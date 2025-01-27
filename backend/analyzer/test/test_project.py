import pytest

from analyzer.models import Project, Dependency, Report, CVEObject
from utilities.constants import BaseSeverity, Status


@pytest.mark.django_db()
class TestHelperClass:

    @pytest.fixture()
    def db(self):
        self.project = Project.objects.create(project_id="Test125", deployment_threshold=BaseSeverity.MEDIUM.name)
        dependency = Dependency.objects.create(project=self.project, dependency_name="math.js")

        cve_object = CVEObject.objects.create(cve_id="Test1234", base_severity=BaseSeverity.HIGH.name)
        Report.objects.create(dependency=dependency, cve_object=cve_object)
        cve_object2 = CVEObject.objects.create(cve_id="5342", base_severity=BaseSeverity.MEDIUM.name)
        Report.objects.create(dependency=dependency, cve_object=cve_object2)
        cve_object3 = CVEObject.objects.create(cve_id="23ads", base_severity=BaseSeverity.HIGH.name)
        Report.objects.create(dependency=dependency, cve_object=cve_object3)

        dependency2 = Dependency.objects.create(project=self.project, dependency_name="request.js")
        cve_object4 = CVEObject.objects.create(cve_id="ola", base_severity=BaseSeverity.CRITICAL.name)
        Report.objects.create(dependency=dependency2, cve_object=cve_object4)
        cve_object5 = CVEObject.objects.create(cve_id="loa", base_severity=BaseSeverity.NA.name)
        Report.objects.create(dependency=dependency2, cve_object=cve_object5)

    def test_count_vulnerabilities(self, db):
        counted = self.project.vulnerabilities_count([Status.REVIEW.name])
        true_data = {BaseSeverity.CRITICAL.name: 1,
                     BaseSeverity.HIGH.name: 2,
                     BaseSeverity.MEDIUM.name: 1,
                     BaseSeverity.LOW.name: 0,
                     BaseSeverity.NONE.name: 0,
                     BaseSeverity.NA.name: 1
                     }
        assert true_data == counted

    def test_dependency_count(self, db):
        assert self.project.dependency_count == 2

    def test_resolved_report_count(self, db):
        assert self.project.resolved_report_count == 0

    def test_solution_distribution(self, db):
        solution_distribution = self.project.solution_distribution
        assert solution_distribution == {
            "NO_SOLUTION_NEEDED": 0,
            "SOLUTION_AVAILABLE": 0,
            "SOLUTION_IMPLEMENTED": 0,
            "SOLUTION_NOT_AVAILABLE": 0,
            "SOLUTION_NOT_NEEDED": 0,
            "SOLUTION_PARTIALLY_IMPLEMENTED": 0,
            "SOLUTION_UNKNOWN": 0,
        }

    def test_status_distribution(self, db):
        status_distribution = self.project.status_distribution
        assert status_distribution == {
            "REVIEW": 5,
            "NO_THREAT": 0,
            "THREAT_FIXED": 0,
            "THREAT_NOT_FIXED": 0,
            "THREAT_UNKNOWN": 0,
        }

    def test_calculate_risk_score(self, db):
        risk_score = self.project.calculate_risk_score
        assert risk_score == 1 - (1 - 0) * (1 - 0) * (1 - 0) * (1 - 0) * (1 - 0)
