from datetime import datetime

import pytest

from analyzer.services.cve_fetcher import CVEFetcher
from utilities.constants import BaseSeverity, AttackVector, AttackComplexity, UserInteraction, IntegrityImpact, \
    AvailabilityImpact, ConfidentialityImpact, Scope, PrivilegesRequired

cve_id = "CVE-2021-44228"


@pytest.fixture
def cve_data():
    fetcher = CVEFetcher(cve_id=cve_id)
    return fetcher.generate()


@pytest.mark.nvd_integration
def test_real_nvd_api_contract():
    fetcher = CVEFetcher(cve_id=cve_id)
    data = fetcher.generate()
    assert fetcher.successful
    assert len(data["description"]) > 0
    assert 0 < data["cve_attributes"]["baseScore"] <= 10


def test_description(cve_data):
    assert len(cve_data["description"]) > 0


def test_dates(cve_data):
    published = cve_data["published"]
    assert isinstance(published, datetime)
    updated = cve_data["updated"]
    assert isinstance(updated, datetime)


def test_cve_attributes_cvss_v3(cve_data):
    attributes = cve_data["cve_attributes"]
    assert 0 < attributes["baseScore"] <= 10
    assert attributes["baseSeverity"] in BaseSeverity.names
    assert attributes["attackVector"] in AttackVector.names
    assert attributes["attackComplexity"] in AttackComplexity.names
    assert attributes["privilegesRequired"] in PrivilegesRequired.names
    assert attributes["userInteraction"] in UserInteraction.names
    assert attributes["confidentialityImpact"] in ConfidentialityImpact.names
    assert attributes["integrityImpact"] in IntegrityImpact.names
    assert attributes["availabilityImpact"] in AvailabilityImpact.names
    assert attributes["scope"] in Scope.names


def test_epss_score(cve_data):
    assert 0 <= float(cve_data["epss"]) <= 1.0


def test_vendor_reference(cve_data):
    assert len(cve_data["vendor_reference"]) >= 0
