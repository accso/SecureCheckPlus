import pytest

import analyzer.services.threshold_check as tc

from analyzer.models import Project, Dependency, Report, CVEObject
from utilities.constants import Threshold


@pytest.mark.django_db()
class TestThresholdCheck:
    @pytest.fixture()
    def db(self):
        self.project = Project.objects.create(project_id="Test", deployment_threshold=Threshold.LOW.name)
        self.dependency = Dependency.objects.create(project=self.project, dependency_name="test.js")
        self.dependency2 = Dependency.objects.create(project=self.project, dependency_name="test2.js")
        self.cve_object = CVEObject.objects.create(cve_id="123", base_severity=Threshold.HIGH.name)
        self.cve_object3 = CVEObject.objects.create(cve_id="1333", base_severity=Threshold.MEDIUM.name)
        self.cve_object4 = CVEObject.objects.create(cve_id="13323", base_severity=Threshold.LOW.name)
        Report.objects.create(dependency=self.dependency, cve_object=self.cve_object)  # Severity High
        Report.objects.create(dependency=self.dependency2, cve_object=self.cve_object3)  # Severity Medium
        Report.objects.create(dependency=self.dependency, cve_object=self.cve_object4)  # Severity Low

    def test_finding_severities(self, db):
        solution = Threshold.HIGH.value
        assert solution == tc.search_for_highest_threat(self.project)

    def test_deployment_evaluation(self, db):
        assert not tc.is_deployable(self.project.project_id)

        self.project.deployment_threshold = Threshold.CRITICAL.name
        self.project.save()
        assert tc.is_deployable(self.project.project_id)

        self.project.deployment_threshold = Threshold.HIGH.name
        self.project.save()
        assert not tc.is_deployable(self.project.project_id)

        self.project.deployment_threshold = Threshold.NEVER.name
        self.project.save()
        assert not tc.is_deployable(self.project.project_id)

        self.project.deployment_threshold = Threshold.ALWAYS.name
        self.project.save()
        assert tc.is_deployable(self.project.project_id)
