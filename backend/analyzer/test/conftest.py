from unittest.mock import patch

import pytest

MOCK_NVD_RESPONSE = {
    "vulnerabilities": [
        {
            "cve": {
                "id": "CVE-2021-44228",
                "published": "2025-01-01T00:00:00Z",
                "lastModified": "2025-01-01T00:00:00Z",
                "descriptions": [{"value": "A test vulnerability description."}],
                "metrics": {
                    "cvssMetricV31": [
                        {
                            "cvssData": {
                                "baseScore": 7.5,
                                "baseSeverity": "HIGH",
                                "attackVector": "NETWORK",
                                "attackComplexity": "LOW",
                                "privilegesRequired": "NONE",
                                "userInteraction": "NONE",
                                "confidentialityImpact": "HIGH",
                                "integrityImpact": "NONE",
                                "availabilityImpact": "NONE",
                                "scope": "UNCHANGED",
                            }
                        }
                    ]
                },
                "weaknesses": [{"description": [{"value": "CWE-94"}]}],
                "references": [{"url": "https://example.com/advisory", "tags": ["Vendor Advisory"]}],
            }
        }
    ]
}

MOCK_EPSS_RESPONSE = {"data": [{"epss": 0.5}]}


def _mock_requests_get(url, **kwargs):
    class MockResponse:
        def __init__(self, json_data, status_code):
            self.json_data = json_data
            self.status_code = status_code

        def json(self):
            return self.json_data

    url_str = str(url)
    if "nvd.nist.gov" in url_str:
        return MockResponse(MOCK_NVD_RESPONSE, 200)
    if "api.first.org" in url_str:
        return MockResponse(MOCK_EPSS_RESPONSE, 200)
    raise ConnectionError(f"Unexpected request: {url_str}")


@pytest.fixture(autouse=True)
def no_nvd_network(request):
    if request.node.get_closest_marker("nvd_integration"):
        yield
        return
    with patch("analyzer.services.cve_fetcher.requests.get", side_effect=_mock_requests_get), \
         patch("analyzer.services.cve_fetcher.time.sleep"):
        yield
