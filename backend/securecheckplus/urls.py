"""SecureCheckPlus URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os

from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.http import HttpResponse
from django.urls import path, include, re_path
from django.views.generic.base import TemplateView

from analyzer.views import AnalyzeReport, health_endpoint
from securecheckplus.settings import BASE_URL
from webserver.views.misc_views import AppView, HtmlView

webserver_path = f"{BASE_URL}/api/" if BASE_URL else "api/"
analyzer_path = f"{BASE_URL}/analyzer/api" if BASE_URL else "analyzer/api"
base_url_pattern = f'^{BASE_URL}/' if BASE_URL else '^'

urlpatterns = [
    path(analyzer_path, AnalyzeReport.as_view()),
    path("check_health", health_endpoint),
    path(webserver_path, include("webserver.urls")),
    path("robots.txt", TemplateView.as_view(template_name="robots.txt", content_type="text/plain")),
    re_path(rf'{base_url_pattern}html/(?P<template_name>[-a-z_A-Z0-9]+)\.html$', HtmlView.as_view()),
    re_path(rf'{base_url_pattern}(?:.*)/?$', AppView.as_view()),
]

# Serving the media files in development mode
if settings.IS_DEV:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    urlpatterns += staticfiles_urlpatterns()
