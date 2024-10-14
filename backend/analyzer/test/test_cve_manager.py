import pytest

from analyzer.manager.cve_manager import CVEObjectManager
from analyzer.models import CVEObject

cve_id = "CVE-2021-44228"
cve_id2 = "CVE-2022-32922"


@pytest.fixture()
def real_cve_object(db) -> CVEObject:
    return CVEObjectManager(cve_id).get()


@pytest.fixture()
def dummy_cve_object(db) -> CVEObject:
    return CVEObject.objects.create(cve_id=cve_id2)


@pytest.mark.django_db
def test_string_init():
    object_manager = CVEObjectManager(cve_id)
    assert isinstance(object_manager.get(), CVEObject)
    assert object_manager.get() == CVEObject.objects.get(cve_id=cve_id)
    assert 0 <= object_manager.get().cvss <= 10


def test_single_object_init(real_cve_object):
    object_manager = CVEObjectManager(real_cve_object)
    assert isinstance(object_manager.get(), CVEObject)
    assert object_manager.get() == real_cve_object


def test_multiple_object_init(real_cve_object, dummy_cve_object):
    object_manager = CVEObjectManager([real_cve_object, dummy_cve_object])
    assert real_cve_object in object_manager.get()
    assert dummy_cve_object in object_manager.get()

    for cve_element in object_manager.get():
        assert isinstance(cve_element, CVEObject)


def test_update_single_object(real_cve_object):
    real_cve_object.cvss = -12
    real_cve_object.save()
    assert real_cve_object.cvss == -12

    object_manager = CVEObjectManager(real_cve_object)
    object_manager.update_cve()
    assert 0 <= object_manager.get().cvss <= 10


def test_update_multiple_objects(real_cve_object, dummy_cve_object):
    cve_objects = [real_cve_object, dummy_cve_object]
    cve_objects[0].cvss = -12
    cve_objects[0].save()
    assert cve_objects[0].cvss == -12
    assert cve_objects[1].cvss is None

    object_manager = CVEObjectManager(cve_objects)
    object_manager.update_cve()
    cve_objects = object_manager.get()

    assert 0 <= cve_objects[0].cvss <= 10
    assert 0 <= cve_objects[1].cvss <= 10
