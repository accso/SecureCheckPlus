import logging
import time
from urllib import parse

import requests
from django.utils.dateparse import parse_datetime
from requests.exceptions import RequestException

from utilities.constants import NVD_ADDRESS, EPSS_ADDRESS
from securecheckplus.settings import NVD_API_KEY

logger = logging.getLogger(__name__)


class CVEFetcher:
    """
    CVEFetcher is a utility class for fetching and processing Common Vulnerabilities and Exposures (CVE) data
    from the National Institute of Standards and Technology (NIST) and the Exploit Prediction Scoring System (EPSS).

    Attributes:
        cve_id (str): The CVE identifier to fetch data for.
        data (dict): A dictionary to store the fetched CVE data.
        successful (bool): Indicates whether the fetch operation was successful.

    Class Attributes:
        DEFAULT_CVE_ATTRIBUTES (dict): Default values for CVE attributes to ensure all necessary fields are present.

    Methods:
        fetch_from_nist_gov():
            Fetches CVE data from the NIST government server using the provided CVE ID.
        
        fetch_epss():
            Fetches the EPSS score for the given CVE ID.
        
        generate() -> dict:
            Initiates the data fetching process from both NIST and EPSS and returns the aggregated data.
        
        _find_vendor_reference(references) -> str:
            Searches for and returns the vendor advisory URL from a list of references.
        
        _find_cwes(weaknesses) -> list:
            Extracts and returns a list of CWE identifiers from the provided weaknesses data.
    """

    DEFAULT_CVE_ATTRIBUTES = {
        "attackVector": "N/A",
        "attackComplexity": "N/A",
        "privilegesRequired": "N/A",
        "userInteraction": "N/A",
        "confidentialityImpact": "N/A",
        "integrityImpact": "N/A",
        "availabilityImpact": "N/A",
        "scope": "N/A",
        "baseScore": "N/A",
        "baseSeverity": "N/A"
    }

    def __init__(self, cve_id: str):
        """
        Initializes the CVEFetcher with a specific CVE ID.

        Args:
            cve_id (str): The CVE identifier to fetch data for.
        """
        self.cve_id = cve_id
        self.data = {}
        self.successful = False

    def fetch_from_nist_gov(self):
        """
        Fetches CVE data from the NIST government server for the given CVE ID.

        Sends a GET request to the NIST API using the CVE ID, processes the response,
        and updates the `data` attribute with relevant information.

        Raises:
            ValueError: If the response structure is invalid or missing expected data.
        """
        try:
            headers = {"apiKey": NVD_API_KEY}
            url = parse.urlunparse(NVD_ADDRESS) + self.cve_id
            logger.info(f"Fetching CVE data from NIST for CVE ID: {self.cve_id} using URL: {url}")
            response = requests.get(url, headers=headers)

            if response.status_code != 200:
                logger.warning(
                    f"Failed to fetch CVE data for CVE ID: {self.cve_id}. HTTP status: {response.status_code}")
                return

            response_json = response.json()
            time.sleep(2)

            if not isinstance(response_json, dict) or "vulnerabilities" not in response_json:
                raise ValueError(f"Invalid response structure for CVE ID: {self.cve_id}")

            scoped_data = response_json["vulnerabilities"][0].get("cve", {})

            metrics = scoped_data.get("metrics", {})
            cve_attributes = self.DEFAULT_CVE_ATTRIBUTES.copy()

            for key in metrics:
                if key.startswith("cvssMetricV3"):
                    cvss_data = metrics[key][0].get("cvssData", {})
                    cve_attributes.update(cvss_data)  # Merge actual values with defaults
                    break  # Exit after finding the first matching cvssMetricV3x

            self.successful = True

            key_map = {
                "description": scoped_data.get("descriptions", [{}])[0].get("value", "N/A"),
                "published": parse_datetime(scoped_data.get("published", "N/A")),
                "updated": parse_datetime(scoped_data.get("lastModified", "N/A")),
                "cve_attributes": cve_attributes,
                "vendor_reference": self._find_vendor_reference(scoped_data.get("references", [])),
                "cwes": self._find_cwes(scoped_data.get("weaknesses", []))
            }

            # Update self.data with the new data
            self.data.update(key_map)

            logger.info(f"Successfully fetched CVE data for CVE ID: {self.cve_id}")

        except requests.ConnectionError as ce:
            logger.error(f"Could not connect to NIST Gov Server while fetching CVE ID: {self.cve_id}. Error: {ce}")
        except RequestException as re:
            logger.error(f"Request failed for CVE ID: {self.cve_id}. Error: {re}")
        except (ValueError, KeyError) as e:
            logger.error(f"Failed to retrieve or process CVE data for CVE ID: {self.cve_id}. Error: {e}")

    def fetch_epss(self):
        """
        Fetches the Exploit Prediction Scoring System (EPSS) score for the given CVE ID.

        Sends a GET request to the EPSS API and updates the `data` attribute with the EPSS score.
        If the request fails or the response is invalid, it sets the EPSS score to 0.

        """
        try:
            url = parse.urlunparse(EPSS_ADDRESS) + self.cve_id
            logger.info(f"Fetching EPSS score for CVE ID: {self.cve_id} using URL: {url}")
            epss_response = requests.get(url)

            if epss_response.status_code != 200:
                raise RequestException(
                    f"Failed to fetch EPSS score for CVE ID: {self.cve_id}. HTTP status: {epss_response.status_code}")

            self.data["epss"] = epss_response.json().get("data", [{}])[0].get("epss", 0)
            logger.info(f"Successfully fetched EPSS score for CVE ID: {self.cve_id}")

        except (RequestException, KeyError) as ex:
            logger.warning(f"Could not fetch EPSS score for CVE ID: {self.cve_id}. Error: {ex}")
            self.data["epss"] = 0

    def generate(self) -> dict:
        """
        Initiates the data fetching process from both NIST and EPSS and returns the aggregated data.

        Orchestrates the fetching of CVE details from NIST and the EPSS score,
        then compiles the information into the `data` attribute.

        Returns:
            dict: A dictionary containing the aggregated CVE data and EPSS score.
        """
        logger.info(f"Starting data generation for CVE ID: {self.cve_id}")
        self.fetch_from_nist_gov()
        self.fetch_epss()
        logger.info(f"Completed data generation for CVE ID: {self.cve_id}")
        return self.data

    def _find_vendor_reference(self, references):
        """
        Searches for a vendor advisory URL within a list of references.

        Args:
            references (list): A list of reference dictionaries to search through.

        Returns:
            str: The vendor advisory URL if found; otherwise, "N/A".
        """
        for reference in references:
            if "Vendor Advisory" in reference.get("tags", []):
                logger.info(f"Vendor Advisory found for CVE ID: {self.cve_id}, URL: {reference['url']}")
                return reference.get("url", "N/A")
        logger.info(f"No Vendor Advisory found for CVE ID: {self.cve_id}")
        return "N/A"

    def _find_cwes(self, weaknesses):
        """
        Extracts CWE identifiers from a list of weaknesses.

        Args:
            weaknesses (list): A list of weakness dictionaries to extract CWEs from.

        Returns:
            list: A list of CWE identifiers found in the weaknesses.
        """
        cwes = []
        for cwe_object in weaknesses:
            cwe_value = cwe_object.get("description", [{}])[0].get("value", "N/A")
            if cwe_value != "N/A":
                logger.info(f"CWE found for CVE ID: {self.cve_id}, CWE: {cwe_value}")
            cwes.append(cwe_value)
        return cwes
