import logging
from typing import Union, List
from analyzer.models import CVEObject
from analyzer.services.cve_fetcher import CVEFetcher

logger = logging.getLogger(__name__)


class CVEObjectManager:
    """
    Manages the creation, updating, and retrieval of CVE objects.

    Attributes:
        cve_objects (List[CVEObject]): A list of CVE objects to be managed.
        created (bool): A flag indicating if a new CVE object was created.
    """

    def __init__(self, cves: Union[str, CVEObject, List[CVEObject]]):
        """
        Initializes the CVEObjectManager with the given CVE object(s) or CVE ID.

        Args:
            cves (Union[str, CVEObject, List[CVEObject]]):
                A single CVE ID (str), a CVE object, or a list of CVE objects.
        """
        self.created = False

        # If the input is a string, we fetch or create a CVE object.
        if isinstance(cves, str):
            cve_object, self.created = CVEObject.objects.get_or_create(cve_id=cves)
            self.cve_objects: List[CVEObject] = [cve_object]

            if self.created:
                logger.info(f"Created new CVE object with ID: {cve_object.cve_id}.")
                self.update_cve()  # Update if a new object is created

        # If it's a single CVE object
        elif isinstance(cves, CVEObject):
            self.cve_objects: List[CVEObject] = [cves]

        # If it's a list of CVE objects
        else:
            self.cve_objects = cves

    def update_cve(self):
        """
        Updates CVE objects with data fetched from external sources (e.g., NIST, EPSS).

        The method fetches data for each CVE object using the CVEFetcher and updates
        their attributes such as CVSS score, EPSS score, base severity, etc. The CVE
        objects are saved after successful updates.
        """
        try:
            logger.info(f"Starting the CVE update process for {len(self.cve_objects)} CVE objects.")

            for cve in self.cve_objects:
                logger.info(f"Processing CVE ID: {cve.cve_id}")
                cve_fetcher = CVEFetcher(cve_id=cve.cve_id)
                cve_data = cve_fetcher.generate()

                if cve_fetcher.successful:
                    # Update CVE object attributes with fetched data
                    cve.cvss = cve_data["cve_attributes"].get("baseScore", "N/A")
                    cve.epss = cve_data.get("epss", 0)
                    cve.base_severity = cve_data["cve_attributes"].get("baseSeverity", "N/A")
                    cve.published = cve_data.get("published", "N/A")
                    cve.updated = cve_data.get("updated", "N/A")
                    cve.description = cve_data.get("description", "N/A")
                    cve.attack_vector = cve_data["cve_attributes"].get("attackVector", "N/A")
                    cve.attack_complexity = cve_data["cve_attributes"].get("attackComplexity", "N/A")
                    cve.privileges_required = cve_data["cve_attributes"].get("privilegesRequired", "N/A")
                    cve.user_interaction = cve_data["cve_attributes"].get("userInteraction", "N/A")
                    cve.confidentiality_impact = cve_data["cve_attributes"].get("confidentialityImpact", "N/A")
                    cve.integrity_impact = cve_data["cve_attributes"].get("integrityImpact", "N/A")
                    cve.availability_impact = cve_data["cve_attributes"].get("availabilityImpact", "N/A")
                    cve.scope = cve_data["cve_attributes"].get("scope", "N/A")
                    cve.recommended_url = cve_data.get("vendor_reference", "N/A")

                    # Save the updated CVE object
                    cve.save()
                    logger.info(f"Updated CVE object with ID: {cve.cve_id} successfully.")
                else:
                    logger.warning(f"Failed to fetch data for CVE ID: {cve.cve_id}. Skipping update for this CVE.")

            logger.info("CVE update process completed successfully.")

        except Exception as e:
            logger.error(f"An error occurred during the CVE update process: {str(e)}", exc_info=True)

    def get(self) -> Union[CVEObject, List[CVEObject]]:
        """
        Returns the managed CVE objects.

        :return: A single CVEObject if there is only one, or a list of CVEObjects if there are multiple.
        """
        if len(self.cve_objects) == 1:
            return self.cve_objects[0]  # Return the single object
        return self.cve_objects  # Return the list if there are multiple

