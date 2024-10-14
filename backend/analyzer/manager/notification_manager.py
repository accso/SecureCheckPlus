"""This module handles notifications when a report has been analyzed."""

import logging
from smtplib import SMTPException
from urllib import parse

from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template

from analyzer.models import Project
from analyzer.services import threshold_check
from utilities import constants, helperclass as helper

logger = logging.getLogger(__name__)


# TODO update in upcoming changes

def notify(project: Project) -> None:
    """Notify all users who want to get notifications for given project.
    If threshold has been met.

    :param project: The project that has been updated.
    :type project: Project
    """
    text_template = get_template("email/threshold_notification.txt")
    html_template = get_template("email/threshold_notification.html")

    users = _find_persons_to_be_notified(project)
    project_data = project.vulnerabilities_count([constants.Status.THREAT.name, constants.Status.REVIEW.name,
                                                  constants.Status.REVIEW_AGAIN.name, constants.Status.THREAT_WIP.name])
    project_data.update(helper.vulnerabilities_in_percentage(project_data))
    project_data.update({"dependencies": project.dependency_count})
    project_data.update({"link_to_project": parse.urlunparse(constants.PROJECT_ADDRESS) + project.project_id})
    project_data.update({"link_to_profile": parse.urlunparse(constants.PROFILE_ADDRESS)})
    project_data.update({"project_id": project.project_id})

    for user in users:
        personal_data = project_data
        personal_data.update({"email": user.username})

        user_threshold = user.notification_threshold.capitalize()
        personal_data.update({"severity": user_threshold})

        text_email = text_template.render(personal_data)
        html_email = html_template.render(personal_data)

        email = EmailMultiAlternatives(subject=f"SecureCheckPlus Report for the Project: {project.project_id}",
                                       body=text_email,
                                       from_email=constants.SERVER_MAIL_ADDRESS,
                                       to=[personal_data["email"]])
        email.attach_alternative(html_email, "text/includes")
        try:
            email.send(fail_silently=False)
        except SMTPException as ex:
            logger.warning(f"An error occurred while sending the e-mail to {personal_data['email']}: {ex}")
    logger.info(f"Notifications for project: {project.project_id} have been sent.")


def _find_persons_to_be_notified(project: Project) -> list:
    """Search for person where threshold conditions are met

    :param project: Project that has been updated.
    :type project: Project
    ...
    :return: A list of all users to be notified.
    :rtype: list[User]
    """

    highest_threat = threshold_check.search_for_highest_threat(project)
    user_watches_project = project.userwatchproject_set.all()
    notify_list = []

    for person in user_watches_project:
        if threshold_check.threshold_reached(person.user.notification_threshold, highest_threat):
            notify_list.append(person.user)

    return notify_list
