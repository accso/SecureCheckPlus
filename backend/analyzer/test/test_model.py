import datetime

from django.db.utils import IntegrityError as DJIntegrityError
from django.test import TestCase

from analyzer.models import Project, CVEObject, Dependency, Report
from utilities.constants import Status
from webserver.models import User


class ProjectTestCase(TestCase):
    def setUp(self):
        self.project_id = "SECURECHECKPLUS"
        self.project_name = "SecureCheckPlus"
        Project.objects.create(project_id=self.project_id, project_name=self.project_name)

    # Test if saved properly
    def test_save_project(self):
        project = Project.objects.get(project_id=self.project_id)
        self.assertEqual(project.project_id, self.project_id)
        self.assertEqual(project.project_name, self.project_name)

    # Test if Models can be updated
    def test_update_project(self):
        project = Project.objects.get(project_id=self.project_id)
        project.project_name = "Test"
        project.save()
        self.assertEqual(project.project_name, "Test")

    # Test if unique constraint is triggered
    def test_unique_project_id(self):
        try:
            Project.objects.create(project_id=self.project_id, project_name="Test")
            self.assertTrue(False)
        except DJIntegrityError:
            self.assertTrue(True)

    # Test if Entity is correctly deleted
    def test_delete_project(self):
        Project.objects.get(project_id=self.project_id).delete()
        self.assertEqual(0, len(Project.objects.filter(project_id=self.project_id)))


class CVEObjectTestCase(TestCase):
    def setUp(self):
        self.cve_id = "CVE2404-23332"
        self.cvss = 5.7
        self.published_date = datetime.datetime(2021, 5, 20)
        self.updated_date = datetime.datetime(2022, 10, 22)
        self.description = "SQL injection possible over user input"
        self.attack_vector = "Network"
        self.attack_complexity = "Low"
        self.privileges_required = "None"
        self.user_interaction = "Required"
        self.confidentiality_impact = "Low"
        self.integrity_impact = "High"
        self.availability_impact = "Low"
        self.scope = "Unchanged"
        self.recommended_url = "www.google.com"

        CVEObject.objects.create(cve_id=self.cve_id,
                                 cvss=self.cvss,
                                 published=self.published_date,
                                 updated=self.updated_date,
                                 description=self.description,
                                 attack_vector=self.attack_vector,
                                 attack_complexity=self.attack_complexity,
                                 privileges_required=self.privileges_required,
                                 user_interaction=self.user_interaction,
                                 confidentiality_impact=self.confidentiality_impact,
                                 integrity_impact=self.integrity_impact,
                                 availability_impact=self.availability_impact,
                                 scope=self.scope,
                                 recommended_url=self.recommended_url)

    # noinspection DuplicatedCode
    # Test if Entity is properly saved
    def test_save_cve_object(self):
        cve_object = CVEObject.objects.get(cve_id=self.cve_id)
        self.assertEqual(cve_object.cve_id, self.cve_id)
        self.assertEqual(str(cve_object.cvss), str(self.cvss))
        self.assertEqual(cve_object.published, self.published_date)
        self.assertEqual(cve_object.updated, self.updated_date)
        self.assertEqual(cve_object.description, self.description)
        self.assertEqual(cve_object.attack_vector, self.attack_vector)
        self.assertEqual(cve_object.attack_complexity, self.attack_complexity)
        self.assertEqual(cve_object.privileges_required, self.privileges_required)
        self.assertEqual(cve_object.user_interaction, self.user_interaction)
        self.assertEqual(cve_object.confidentiality_impact, self.confidentiality_impact)
        self.assertEqual(cve_object.integrity_impact, self.integrity_impact)
        self.assertEqual(cve_object.availability_impact, self.availability_impact)
        self.assertEqual(cve_object.scope, self.scope)
        self.assertEqual(cve_object.recommended_url, self.recommended_url)

    # Test if Unique constraint will trigger
    def test_unique_cve_object(self):
        try:
            CVEObject.objects.create(cve_id=self.cve_id)
            self.assertTrue(False)
        except DJIntegrityError:
            self.assertTrue(True)

    # Test if Entity is deleted properly
    def test_delete_cve_object(self):
        CVEObject.objects.get(cve_id=self.cve_id).delete()
        self.assertEqual(0, len(CVEObject.objects.filter(cve_id=self.cve_id)))


class DependencyTestCase(TestCase):
    def setUp(self):
        self.dependency_name = "test.py"
        self.project = Project.objects.create(project_id="DependencyTest")

        Dependency.objects.create(dependency_name=self.dependency_name,
                                  project=self.project)

    # Test if Entity is saved properly
    def test_save_library(self):
        dependency = Dependency.objects.get(dependency_name=self.dependency_name)
        self.assertEqual(dependency.dependency_name, self.dependency_name)
        self.assertEqual(dependency.project, self.project)

    # Test if Entity is deleted properly
    def test_delete_library(self):
        Dependency.objects.get(dependency_name=self.dependency_name).delete()
        self.assertEqual(0, len(Dependency.objects.filter(dependency_name=self.dependency_name)))

    # Test if associated Entity will delete this Entity
    def test_cascade_delete(self):
        self.project.delete()
        self.assertEqual(0, len(Dependency.objects.filter(dependency_name=self.dependency_name)))


class ReportTestCase(TestCase):
    def setUp(self):
        self.cve = CVEObject.objects.create(cve_id="CVE2304-2333")
        self.project = Project.objects.create(project_id="TestProject")
        self.dependency = Dependency.objects.create(project=self.project)
        self.comment = "Bitte Versionswechsel durchführen"
        self.user = User.objects.create(username="user@acme.de")

        Report.objects.create(dependency=self.dependency,
                              cve_object=self.cve,
                              comment=self.comment,
                              user=self.user)

    # Test if Entity is saved properly
    def test_save_report(self):
        report = Report.objects.get(dependency=self.dependency, cve_object=self.cve)
        self.assertEqual(report.dependency, self.dependency)
        self.assertEqual(report.cve_object, self.cve)
        self.assertEqual(report.comment, self.comment)
        self.assertEqual(report.user, self.user)
        self.assertEqual(report.status, Status.REVIEW.name)
        self.assertIsNotNone(report.update_date)

    # Test if Entity will be deleted if associated Entity is deleted
    def test_cascade_deletion(self):
        Dependency.objects.get(dependency_name=self.dependency.dependency_name).delete()
        self.assertEqual(0, len(Report.objects.all()))

    # Test if Entity will be deleted properly
    def test_delete_report(self):
        Report.objects.get(dependency=self.dependency, cve_object=self.cve).delete()
        self.assertEqual(0, len(Report.objects.all()))


class ProjectModelTestCase(TestCase):
    def setUp(self):
        self.project = Project.objects.create(project_id="TestProject")

    def test_dependency_count(self):
        Dependency.objects.create(dependency_name="test.py", project=self.project)
        self.assertEqual(self.project.dependency_count, 1)

    def test_resolved_report_count(self):
        dependency = Dependency.objects.create(dependency_name="test.py", project=self.project)
        cve = CVEObject.objects.create(cve_id="CVE2304-2333")
        Report.objects.create(dependency=dependency, cve_object=cve, status=Status.NO_THREAT.name)
        self.assertEqual(self.project.resolved_report_count, 1)

    def test_solution_distribution(self):
        dependency = Dependency.objects.create(dependency_name="test.py", project=self.project)
        cve = CVEObject.objects.create(cve_id="CVE2304-2333")
        Report.objects.create(dependency=dependency, cve_object=cve, status=Status.NO_THREAT.name, solution="Solution1")
        self.assertEqual(self.project.solution_distribution, {"Solution1": 1})

    def test_status_distribution(self):
        dependency = Dependency.objects.create(dependency_name="test.py", project=self.project)
        cve = CVEObject.objects.create(cve_id="CVE2304-2333")
        Report.objects.create(dependency=dependency, cve_object=cve, status=Status.REVIEW.name)
        self.assertEqual(self.project.status_distribution, {Status.REVIEW.name: 1})

    def test_calculate_risk_score(self):
        dependency = Dependency.objects.create(dependency_name="test.py", project=self.project)
        cve = CVEObject.objects.create(cve_id="CVE2304-2333", epss=0.5)
        Report.objects.create(dependency=dependency, cve_object=cve)
        self.assertEqual(self.project.calculate_risk_score, 0.5)

    def test_vulnerabilities_count(self):
        dependency = Dependency.objects.create(dependency_name="test.py", project=self.project)
        cve = CVEObject.objects.create(cve_id="CVE2304-2333", base_severity="High")
        Report.objects.create(dependency=dependency, cve_object=cve, status=Status.REVIEW.name)
        self.assertEqual(self.project.vulnerabilities_count([Status.REVIEW.name]), {"High": 1})
