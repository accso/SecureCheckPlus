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
