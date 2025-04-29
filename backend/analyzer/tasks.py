from celery import shared_task
from celery.schedules import crontab

import sys
from .models import Project
from analyzer.manager.project_manager import ProjectManager
from analyzer.celery import app

@shared_task
def check_projects_for_new_cves():
    """
    Celery task to check all projects for new CVEs and notify maintainers if necessary.
    If a project has a repository URL and access token, it will clone the repository,
    run the dependency-checker, and update the project data.
    """
    for project in Project.objects.all():
        sys.stdout.write("Hello")
        if project.repository_url and project.access_token:
            project_manager = ProjectManager(project)
            project_manager.run_dependency_checker()
        project.check_for_new_cves()

# Schedule the task to run daily
app.conf.beat_schedule = {
    'check-projects-daily': {
        'task': 'analyzer.tasks.check_projects_for_new_cves',
        'schedule': crontab(hour=0, minute=0),  # Runs daily at midnight
    },
    'check-projects-every-minute': {
        'task': 'analyzer.tasks.check_projects_for_new_cves',
        'schedule': crontab("* * * * *"),
    }
}