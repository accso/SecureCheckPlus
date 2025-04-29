from .models import Project
from analyzer.manager.project_manager import ProjectManager

def check_projects_for_new_cves():
    """
    Celery task to check all projects for new CVEs and notify maintainers if necessary.
    If a project has a repository URL and access token, it will clone the repository,
    run the dependency-checker, and update the project data.
    """
    for project in Project.objects.all():
        if project.repository_url and project.access_token:
            project_manager = ProjectManager(project)
            project_manager.run_dependency_checker()