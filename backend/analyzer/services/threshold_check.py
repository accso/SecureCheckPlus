import logging

from analyzer.models import Project
from django.db.utils import DatabaseError
from utilities.constants import Threshold, BaseSeverity, Status


# TODO update in upcoming changes

def is_deployable(project_id: str) -> bool:
    """Check whether a project is deployable based on the given threshold.

    :param project_id: ID of the project to be checked.
    :type project_id: str
    ...
    :return: A boolean whether the project should be deployed.
    :rtype: bool
    """

    try:
        project = Project.objects.get(project_id=project_id)
        threshold = project.deployment_threshold
    except Project.DoesNotExist:
        logging.getLogger(__name__).warning(
            f"Can't check deployable status because project {project_id} does not exist.")
        raise DatabaseError

    highest_threat = search_for_highest_threat(project)

    has_been_reached = threshold_reached(threshold, highest_threat)

    logging.getLogger(__name__).info(f"Successfully check project {project_id} with threshold {threshold}."
                                     f"Deployable: {not has_been_reached}")
    return not has_been_reached


def threshold_reached(threshold: str, highest_detected_threat: int) -> bool:
    """Check if the threshold has been reached.

    :param threshold: The threshold to check against
    :type threshold: str
    :param highest_detected_threat: The constants of the highest detected thread.
    :type highest_detected_threat: int
    ...
    :return: A boolean whether the threshold has been reached. False if not been reached, else True
    :rtype: bool
    """

    try:
        threshold_value = Threshold[threshold]
    except ValueError:
        threshold_value = Threshold["MEDIUM"]

    return highest_detected_threat >= threshold_value


def search_for_highest_threat(project: Project) -> int:
    """Search for all unique severities in a project.

    :param project: The project to check severities against.
    :type project: Project
    ...
    :return: The highest threat level as defined in constants.BaseSeverity
    :rtype: int
    """

    dependencies = project.dependency_set.all()

    threat_levels = [BaseSeverity[report.cve_object.base_severity]
                     for dependency in dependencies
                     for report in dependency.report_set.all() if
                     report.status not in [Status.NO_THREAT.name, Status.THREAT_FIXED] and report.dependency.in_use]

    return 0 if len(threat_levels) == 0 else max(threat_levels)
