import pytest

from analyzer.manager.parser_manager import ParserManager
from analyzer.manager.project_manager import ProjectManager
from analyzer.models import Project, Dependency
from analyzer.test.fixtures import get_owasp_json


@pytest.fixture()
def dummy_project(db) -> Project:
    return Project.objects.create(project_id="Test-Project")


def test_project_init_with_object(dummy_project):
    project_manager = ProjectManager(dummy_project)
    assert project_manager.get() == dummy_project


def test_valid_project_init_with_string(dummy_project):
    project_manager = ProjectManager("Test-Project")
    assert project_manager.get() == dummy_project


@pytest.mark.django_db
def test_invalid_project_init_with_string():
    with pytest.raises(Project.DoesNotExist):
        ProjectManager("Invalid-Name")


def test_api_key(dummy_project):
    project_manager = ProjectManager(dummy_project)
    key = project_manager.generate_key()
    assert len(key) == 43
    assert project_manager.verify_key(key)


def test_project_has_changed(dummy_project):
    project_manager = ProjectManager(dummy_project)
    new_data = ParserManager(tool_name="owasp", file_type="json").parse(get_owasp_json())
    assert project_manager.has_changed(new_data)


def test_update_project(dummy_project):
    data = ParserManager(tool_name="owasp", file_type="json").parse(get_owasp_json())
    project_manager = ProjectManager(dummy_project)

    project_manager.update_project(data)

    project = project_manager.get()

    dependency_names = project.dependency_set.values_list("dependency_name", flat=True)

    assert "bootstrap" in dependency_names
    assert "jquery" in dependency_names

    dependencies = [Dependency.objects.get(dependency_name="bootstrap"),
                    Dependency.objects.get(dependency_name="jquery")]

    assert dependencies[0].version == "3.3.6"
    assert dependencies[1].version == "1.11.1"

    assert dependencies[0].path != "" or None
    assert dependencies[1].path != "" or None

    assert len(dependencies[0].report_set.all()) == 5
    assert len(dependencies[1].report_set.all()) == 4

    dependency_reports = dependencies[0].report_set.all().values_list(
        "cve_object__cve_id", flat=True
    )

    dependency_reports2 = dependencies[1].report_set.all().values_list(
        "cve_object__cve_id", flat=True
    )

    assert set(dependency_reports) == {"CVE-2016-10735", "CVE-2018-14040", "CVE-2018-14041", "CVE-2018-14042",
                                       "CVE-2019-8331"}

    assert (set(dependency_reports2)) == {"CVE-2015-9251", "CVE-2019-11358", "CVE-2020-11022", "CVE-2020-11023"}


@pytest.mark.django_db
def test_generate_key(dummy_project):
    project_manager = ProjectManager(dummy_project)
    key = project_manager.generate_key()
    assert len(key) == 43
    assert project_manager.verify_key(key)


@pytest.mark.django_db
def test_verify_key(dummy_project):
    project_manager = ProjectManager(dummy_project)
    key = project_manager.generate_key()
    assert project_manager.verify_key(key)
    assert not project_manager.verify_key("invalid_key")


@pytest.mark.django_db
def test_update_project_with_no_changes(dummy_project):
    data = ParserManager(tool_name="owasp", file_type="json").parse(get_owasp_json())
    project_manager = ProjectManager(dummy_project)
    project_manager.update_project(data)
    assert not project_manager.has_changed(data)


@pytest.mark.django_db
def test_update_project_with_new_data(dummy_project):
    data = ParserManager(tool_name="owasp", file_type="json").parse(get_owasp_json())
    project_manager = ProjectManager(dummy_project)
    project_manager.update_project(data)
    new_data = {
        "new_dependency:1.0.0": {
            "dependency_name": "new_dependency",
            "version": "1.0.0",
            "path": "path/to/new_dependency",
            "license": "MIT",
            "vulnerabilities": ["CVE-2021-12345"],
            "package_manager": "npm"
        }
    }
    assert project_manager.has_changed(new_data)
    project_manager.update_project(new_data)
    assert not project_manager.has_changed(new_data)
    dependency_names = project_manager.get().dependency_set.values_list("dependency_name", flat=True)
    assert "new_dependency" in dependency_names
