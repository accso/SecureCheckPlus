from datetime import datetime

from analyzer.services.cve_fetcher import CVEFetcher
from utilities.constants import BaseSeverity, AttackVector, AttackComplexity, UserInteraction, IntegrityImpact, \
    AvailabilityImpact, ConfidentialityImpact, Scope, PrivilegesRequired

cve_id = "CVE-2021-44228"
cve_fetcher = CVEFetcher(cve_id=cve_id)
cve_data = cve_fetcher.generate()


def test_description():
    assert len(cve_data["description"]) > 0


def test_dates():
    published = cve_data["published"]
    assert isinstance(published, datetime)

    updated = cve_data["updated"]
    assert isinstance(updated, datetime)


def test_cve_attributes_cvss_v3():
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


def test_epss_score():
    assert 0 <= float(cve_data["epss"]) <= 1.0


def test_vendor_reference():
    assert len(cve_data["vendor_reference"]) >= 0


def test_find_vendor_reference():
    references = [
        {"url": "http://example.com", "tags": ["Vendor Advisory"]},
        {"url": "http://example2.com", "tags": []}
    ]
    vendor_reference = cve_fetcher._find_vendor_reference(references)
    assert vendor_reference == "http://example.com"


def test_find_cwes():
    weaknesses = [
        {"description": [{"value": "CWE-79"}]},
        {"description": [{"value": "CWE-89"}]}
    ]
    cwes = cve_fetcher._find_cwes(weaknesses)
    assert cwes == ["CWE-79", "CWE-89"]
