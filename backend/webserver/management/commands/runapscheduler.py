import logging

from django.conf import settings

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from django.core.management.base import BaseCommand
from django_apscheduler.jobstores import DjangoJobStore
from django_apscheduler.models import DjangoJobExecution
from django_apscheduler import util
from analyzer.models import Project, CVEObject, CPEObject, Dependency, Report
from analyzer.manager.cve_manager import CVEObjectManager
from analyzer.services.cve_fetcher import CVEFetcher

logger = logging.getLogger(__name__)


def update_cves():
    logger.info("start job")
    projects = Project.objects.filter(auto_update=True)
    for project in projects:
         if project.auto_update:
            cve_objects = CVEObject.objects.filter(report__dependency__project=project)
            CVEObjectManager(cve_objects).update_cve()

def update_deps():
    logger.info("start job")
    projects = Project.objects.filter(auto_update=True)
    cpes_total = []
    for project in projects:
        dependencies = Dependency.objects.filter(project=project)
        for dependency_object in dependencies:
            cpes = CPEObject.objects.filter(dependency=dependency_object)
            for cpe_object in cpes:
                cpes_total.append(cpe_object.cpe_id)
                cve_fetcher = CVEFetcher(cpe_id=cpe_object.cpe_id)
                cve_fetcher.fetch_from_nist_by_cpe()
                if cve_fetcher.successful:
                    for cve in cve_fetcher.data:
                        cve_object = CVEObjectManager(cve).get()
                        report = Report.objects.get_or_create(dependency=dependency_object,
                                                              cve_object=cve_object)[0]
                        logger.info(f"data: {cve}")
                        logger.info(f"report: {report}")
    logger.info(f"cpes: {cpes_total}")






# The `close_old_connections` decorator ensures that database connections, that have become
# unusable or are obsolete, are closed before and after your job has run. You should use it
# to wrap any jobs that you schedule that access the Django database in any way.
@util.close_old_connections
def delete_old_job_executions(max_age=604_800):
    """
    This job deletes APScheduler job execution entries older than `max_age` from the database.
    It helps to prevent the database from filling up with old historical records that are no
    longer useful.

    :param max_age: The maximum length of time to retain historical job execution records.
                    Defaults to 7 days.
    """
    DjangoJobExecution.objects.delete_old_job_executions(max_age)


class Command(BaseCommand):
    help = "Runs APScheduler."

    def handle(self, *args, **options):
        scheduler = BlockingScheduler(timezone=settings.TIME_ZONE)
        scheduler.add_jobstore(DjangoJobStore(), "default")

        scheduler.add_job(
            update_deps,
            trigger=CronTrigger(second="*/59"),  # Every 59 seconds
            id="update_projects",  # The `id` assigned to each job MUST be unique
            max_instances=1,
            replace_existing=True,
        )
        logger.info("Added job 'update_projects'.")

        scheduler.add_job(
            delete_old_job_executions,
            trigger=CronTrigger(
                day_of_week="mon", hour="00", minute="00"
            ),  # Midnight on Monday, before start of the next work week.
            id="delete_old_job_executions",
            max_instances=1,
            replace_existing=True,
        )
        logger.info(
            "Added weekly job: 'delete_old_job_executions'."
        )

        try:
            logger.info("Starting scheduler...")
            scheduler.start()
        except KeyboardInterrupt:
            logger.info("Stopping scheduler...")
            scheduler.shutdown()
            logger.info("Scheduler shut down successfully!")