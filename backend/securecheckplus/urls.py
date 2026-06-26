import os

from django.conf import settings
from django.http import JsonResponse
from django.urls import path, include, re_path
from django.views.generic.base import TemplateView

from analyzer.views import AnalyzeReport, health_endpoint
from securecheckplus.settings import BASE_URL
from webserver.views.misc_views import HtmlView, AppView


def api_404_view(request, exception=None):
    """Return JSON 404 for API requests instead of HTML"""
    return JsonResponse(
        {"detail": "Not found."},
        status=404,
        content_type="application/json"
    )


webserver_path = f"{BASE_URL}/api/" if BASE_URL else "api/"
analyzer_path = f"{BASE_URL}/analyzer/api" if BASE_URL else "analyzer/api"
base_url_pattern = f'^{BASE_URL}/' if BASE_URL else '^'

urlpatterns = [
    path(analyzer_path, AnalyzeReport.as_view()),
    path("check_health", health_endpoint),
    path(webserver_path, include("webserver.urls")),
    path("robots.txt", TemplateView.as_view(template_name="robots.txt", content_type="text/plain")),
]

# In native dev mode (python manage.py runserver), keep SPA routes as a fallback.
# In 3-tier Docker mode, Nginx serves the frontend and Django is API-only.
if settings.IS_DEV:
    urlpatterns += [
        re_path(rf'{base_url_pattern}html/(?P<template_name>[-a-z_A-Z0-9]+)\.html$', HtmlView.as_view()),
        re_path(rf'{base_url_pattern}(?:.*)/?$', AppView.as_view()),
    ]

handler404 = api_404_view
