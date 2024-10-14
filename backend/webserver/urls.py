from django.urls import path

from webserver.views.authentication_view import Login, Logout
from webserver.views.misc_views import APIKey, UpdateCVEAPI, UnknownPage
from webserver.views.misc_views import DependenciesAPI
from webserver.views.project_views import ProjectsAPI, ProjectAPI, ProjectsFlatAPI
from webserver.views.report_views import ReportsAPI, ReportAPI
from webserver.views.user_views import UserDataAPI, FavoriteProjectsAPI
from webserver.views.project_views import DeleteProjectAPI

urlpatterns = [
    path("login", Login.as_view()),
    path("logout", Logout.as_view()),
    path("me", UserDataAPI.as_view()),
    path("deleteProjects", DeleteProjectAPI.as_view()),
    path("myFavorites", FavoriteProjectsAPI.as_view()),
    path("projects", ProjectsAPI.as_view()),
    path("projectsFlat", ProjectsFlatAPI.as_view()),
    path("projects/<str:project_id>", ProjectAPI.as_view()),
    path("projects/<str:project_id>/apiKey", APIKey.as_view()),
    path("projects/<str:project_id>/dependencies", DependenciesAPI.as_view()),
    path("projects/<str:project_id>/reports", ReportsAPI.as_view()),
    path("projects/<str:project_id>/reports/<int:report_id>", ReportAPI.as_view()),
    path("projects/<str:project_id>/updateCVE", UpdateCVEAPI.as_view(), {"request_type": "project"}),
    path("cveObjects/update", UpdateCVEAPI.as_view(), {"request_type": "all"}),
    path("cveObject/<str:cve_id>/update", UpdateCVEAPI.as_view(), {"request_type": "single"}),
    path("error404", UnknownPage.as_view())
]
