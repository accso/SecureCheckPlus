import logging
from secrets import token_urlsafe

from django.db import DatabaseError

from analyzer.manager.cve_manager import CVEObjectManager
from analyzer.models import Project, Report, Dependency
from analyzer.parser.types import ParseResult
from utilities.helperclass import hash_key

logger = logging.getLogger(__name__)


class ProjectManager:
  def __init__(self, project: str or Project):
    if isinstance(project, str):
      self.project = Project.objects.get(project_id=project)
    elif isinstance(project, Project):
      self.project = project

  def generate_key(self):
    """Generates an API-Key for the current project. Old API-Keys are automatically invalid.
        :raise DatabaseError: Raises if an error occurred during a database operation while generating an API Key.
        :return: An API-Key.
        """
    key = token_urlsafe(32)
    try:
      self.project.api_key_hash = hash_key(key)
      self.project.save()
    except DatabaseError as dbe:
      logger.critical(
        f"Error during database query for API-Key generation: {str(dbe)}.")

    logger.info(
      f"Generated API-Key for {self.project.project_id} successfully.")
    return key

  def verify_key(self, key: str) -> bool:
    """Hashes the given key and check if the hashed key exists in the database

        :param key: The Api-Key as a string.
        :raise DatabaseError: Raises when an error occurred while trying to retrieve the key from the database.
        :return: A boolean whether the key could be verified.
        """

    try:
      if self.project.api_key_hash == hash_key(key):
        logging.info(
          f"Authentication with API-Key for {self.project.project_id} successful.")
        return True
      else:
        logger.info(
          f"Authentication with API-Key for {self.project.project_id} failed.")
        return False

    except DatabaseError as dbe:
      logger.critical(
        f"Error during database query for API-Key verification: {str(dbe)}.")

  def update_project(self, data: dict[str, ParseResult]):
    """Updates the current project with a dictionary consisting of information extracted from the parser
        :param data: A dictionary with information retrieved from the report by the parser.
        """
    if self.has_changed(data):
      self._update_dependencies(data)

  def has_changed(self, data: dict[str, ParseResult]) -> bool:
    """Check if dependencies and associated cves has been changed.

        :param: data: The new data parsed via parse manager.
        :return: whether the project has changed.
        """

    # Check for dependency changes
    current_dependencies = self.project.dependency_set.filter(in_use=True)
    current_dependencies_keys = set(
      [f"{dependency[0]}:{dependency[1]}" for dependency in
       current_dependencies.values_list("dependency_name", "version")])

    if current_dependencies_keys != set(data.keys()):
      return True

    for dependency in current_dependencies:
      current_cve = dependency.report_set.values_list("cve_object__cve_id",
                                                      flat=True)
      new_cve = data[
        f"{dependency.dependency_name}:{dependency.version}"].vulnerabilities
      if set(current_cve) != set(new_cve):
        return True

    return False

  def get(self):
    """:return: The current project"""
    return self.project

  def _update_dependencies(self, data: dict[str, ParseResult]):
    """Updates the dependencies and associated Reports based on the dictionary object provided by the parser.
        :param data: The data provided by the parser extracted from the report.
        :raise DatabaseError: If an error occurred while performing database operations.
        """
    new_dependencies = set(data.keys())

    try:
      current_dependencies = self.project.dependency_set.all()

      # Deactivate unused dependencies
      for dependency in current_dependencies:
        current_dependency_id = f"{dependency.dependency_name}:{dependency.version}"
        if current_dependency_id not in new_dependencies:
          dependency.in_use = False
          dependency.save()

      # Update existing dependencies and creates new one if it doesn't exist
      for new_dependency_id in data:
        dependency_object = Dependency.objects.get_or_create(
          project=self.project,
          dependency_name=data.get(new_dependency_id).dependency_name,
          version=data.get(new_dependency_id).version,
        )[0]
        dependency_object.package_manager = data.get(
          new_dependency_id).package_manager
        dependency_object.license = data.get(new_dependency_id).license
        dependency_object.path = data.get(new_dependency_id).path
        dependency_object.in_use = True
        dependency_object.save()

        for vulnerability in data.get(new_dependency_id).vulnerabilities:
          cve_object = CVEObjectManager(vulnerability).get()
          report = Report.objects.get_or_create(dependency=dependency_object,
                                                cve_object=cve_object)[0]
          logger.info(
            f"Report with project id: {report.dependency.project.project_id}, dependency name: "
            f"{report.dependency.dependency_name}, CVE-ID: {report.cve_object.cve_id} "
            f"created successfully")

    except DatabaseError as de:
      logger.warning(
        f"An error occurred while trying to create reports. Following exception occurred: {str(de)}."
        f"Project id: {self.project.project_id}.")
