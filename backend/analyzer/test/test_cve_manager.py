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


@pytest.mark.django_db
def test_get_single_cve_object():
    object_manager = CVEObjectManager(cve_id)
    cve_object = object_manager.get()
    assert isinstance(cve_object, CVEObject)
    assert cve_object.cve_id == cve_id


@pytest.mark.django_db
def test_get_multiple_cve_objects():
    object_manager = CVEObjectManager([cve_id, cve_id2])
    cve_objects = object_manager.get()
    assert isinstance(cve_objects, list)
    assert len(cve_objects) == 2
    assert cve_objects[0].cve_id == cve_id
    assert cve_objects[1].cve_id == cve_id2


@pytest.mark.django_db
def test_update_cve_object_attributes(real_cve_object):
    object_manager = CVEObjectManager(real_cve_object)
    object_manager.update_cve()
    cve_object = object_manager.get()
    assert cve_object.cvss is not None
    assert cve_object.epss is not None
    assert cve_object.base_severity is not None
    assert cve_object.published is not None
    assert cve_object.updated is not None
    assert cve_object.description is not None
    assert cve_object.attack_vector is not None
    assert cve_object.attack_complexity is not None
    assert cve_object.privileges_required is not None
    assert cve_object.user_interaction is not None
    assert cve_object.confidentiality_impact is not None
    assert cve_object.integrity_impact is not None
    assert cve_object.availability_impact is not None
    assert cve_object.scope is not None
    assert cve_object.recommended_url is not None
