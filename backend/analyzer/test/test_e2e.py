"""
End-to-end tests for the report analysis pipeline.

These tests verify the full flow: upload a Dependency-Check OWASP report via API,
confirm parsing, DB storage, and threshold behavior. Uses pre-baked JSON fixtures
(no live NVD calls).

Requires: running PostgreSQL (via Docker compose).
Run with:  pytest -m e2e
"""
import json
import os

import pytest
from django.test import LiveServerTestCase
from rest_framework.test import APIRequestFactory

from analyzer.manager.project_manager import ProjectManager
from analyzer.models import CVEObject, Dependency, Project, Report
from analyzer.views import AnalyzeReport


def _load_fixture(name):
    path = os.path.join(os.path.dirname(__file__), "data", name)
    with open(path) as f:
        return f.read()


@pytest.mark.e2e
class TestEndToEndReportAnalysis(LiveServerTestCase):
    """Upload OWASP reports → verify DB state and threshold behavior."""

    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = AnalyzeReport.as_view()

        # Create project
        self.project = Project.objects.create(
            project_id="e2e-test-project",
            project_name="E2E Test",
            deployment_threshold="HIGH",
        )
        self.key = ProjectManager(self.project).generate_key()

    # ------------------------------------------------------------------ #
    # Helpers                                                            #
    # ------------------------------------------------------------------ #
    def _upload(self, fixture_name, params=None):
        report = _load_fixture(fixture_name)
        base_params = {
            "fileType": "json",
            "toolName": "owasp",
            "projectId": "e2e-test-project",
            "projectName": "E2E Test",
            "deploymentThreshold": "HIGH",
        }
        if params:
            base_params.update(params)

        qs = "&".join(f"{k}={v}" for k, v in base_params.items())
        url = f"/analyzer/api?{qs}"

        request = self.factory.post(
            url,
            data=report,
            content_type="application/json",
            HTTP_API_KEY=self.key,
        )
        return self.view(request)

    # ------------------------------------------------------------------ #
    # Tests                                                              #
    # ------------------------------------------------------------------ #
    def test_large_report_parses_correctly(self):
        """Upload the large OWASP fixture → expect 54 deps, 33 CVEs."""
        resp = self._upload("dependency-check-report-python-large.json")
        assert resp.status_code in (200, 406), f"Unexpected {resp.status_code}"

        deps = Dependency.objects.filter(project=self.project)
        assert deps.count() == 54, f"Expected 54 deps, got {deps.count()}"

        reports = Report.objects.filter(dependency__project=self.project)
        assert reports.count() == 33, f"Expected 33 CVEs, got {reports.count()}"

    def test_small_report_parses_correctly(self):
        """Upload the small OWASP fixture → expect 19 deps, 1 CVE."""
        resp = self._upload("dependency-check-report-python-small.json")
        assert resp.status_code in (200, 406), f"Unexpected {resp.status_code}"

        deps = Dependency.objects.filter(project=self.project)
        assert deps.count() == 19, f"Expected 19 deps, got {deps.count()}"

        reports = Report.objects.filter(dependency__project=self.project)
        assert reports.count() == 1, f"Expected 1 CVE, got {reports.count()}"

    def test_cve_ids_valid_format(self):
        """All created CVEObject IDs must match CVE-YYYY-NNNNN+ pattern."""
        self._upload("dependency-check-report-python-large.json")
        cves = CVEObject.objects.all()
        for cve in cves:
            assert cve.cve_id.startswith("CVE-"), f"Bad CVE ID: {cve.cve_id}"
            parts = cve.cve_id.split("-")
            assert len(parts) == 3, f"Bad CVE format: {cve.cve_id}"
            assert parts[1].isdigit(), f"Non-numeric year: {cve.cve_id}"
            assert parts[2].isdigit(), f"Non-numeric ID: {cve.cve_id}"

    def test_cve_severity_not_null(self):
        """Every CVEObject created must have a non-empty base_severity."""
        self._upload("dependency-check-report-python-large.json")
        for cve in CVEObject.objects.all():
            assert cve.base_severity, f"CVE {cve.cve_id} has empty severity"

    def test_threshold_rejects_when_exceeded(self):
        """With LOW threshold, large report should trigger 406."""
        resp = self._upload(
            "dependency-check-report-python-large.json",
            params={"deploymentThreshold": "LOW"},
        )
        assert resp.status_code == 406, f"Expected 406, got {resp.status_code}"

    def test_trivy_report_lands_in_database(self):
        """Upload Trivy fixture → verify deps + CVEs are stored in the DB."""
        resp = self._upload(
            "trivy-report-securechecknext.json",
            params={"toolName": "trivy", "deploymentThreshold": "HIGHEST"},
        )
        assert resp.status_code in (200, 406), f"Unexpected {resp.status_code}"

        deps = Dependency.objects.filter(project=self.project)
        assert deps.count() == 17, f"Expected 17 deps, got {deps.count()}"

        # The trivy fixture has 58 raw vulnerability entries. The parser dedupes
        # within a single dep (so requests@2.32.3 has 2 CVEs, not 4), yielding
        # 56 (dep, cve) pairs. Across 17 deps, 55 unique CVE-objects.
        reports = Report.objects.filter(dependency__project=self.project)
        assert reports.count() == 56, f"Expected 56 Reports, got {reports.count()}"

        cves = CVEObject.objects.filter(report__dependency__project=self.project).distinct()
        assert cves.count() == 55, f"Expected 55 unique CVEObjects, got {cves.count()}"
        for cve in cves:
            assert cve.cve_id, f"Empty CVE id for {cve}"

    def test_cyclonedx_report_lands_in_database(self):
        """Upload CycloneDX fixture → verify components are stored in the DB."""
        resp = self._upload(
            "cyclonedx-report-securechecknext.json",
            params={"toolName": "cyclonedx"},
        )
        assert resp.status_code in (200, 406), f"Unexpected {resp.status_code}"

        deps = Dependency.objects.filter(project=self.project)
        assert deps.count() == 14, f"Expected 14 deps, got {deps.count()}"

        reports = Report.objects.filter(dependency__project=self.project)
        assert reports.count() == 0, f"Expected 0 CVEs, got {reports.count()}"
