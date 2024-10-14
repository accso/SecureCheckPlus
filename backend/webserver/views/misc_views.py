import logging
import os
import traceback

from django.shortcuts import render
from django.views import View
from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from securecheckplus.settings import IS_DEV, BASE_URL

from analyzer.manager.cve_manager import CVEObjectManager
from analyzer.manager.project_manager import ProjectManager
from analyzer.models import Project, CVEObject
from utilities.exceptions import MissingRequiredParameter, NotFoundError, InternalServerError
from utilities.helperclass import log_internal_error, hash_string
from securecheckplus.settings import SALT
from webserver.manager.authorization_manager import permission_required
from webserver.serializer.dependency_serializer import DependencyBasicSerializer

logger = logging.getLogger(__name__)

class HtmlView(View):


    def get(self, request, template_name):

        PREFIX = "/"

        if not IS_DEV and BASE_URL:
            PREFIX = f"/{BASE_URL}/static/"
        elif not IS_DEV and not BASE_URL:
            PREFIX = "/static/"

        context = {
            'IS_DEV': IS_DEV,
            'BASE_URL': "/" + BASE_URL  if BASE_URL else "",
            'PREFIX': PREFIX
        }

        if request.user.is_authenticated:
            return render(request, f"includes/{template_name}.html", context)
        else:
            return render(request, "login.html", context)


class AppView(View):
    def get(self, request):

        PREFIX = "/"

        if not IS_DEV and BASE_URL:
            PREFIX = f"/{BASE_URL}/static/"
        elif not IS_DEV and not BASE_URL:
            PREFIX = "/static/"

        context = {
            'IS_DEV': IS_DEV,
            'BASE_URL': BASE_URL,
            'PREFIX': PREFIX
        }

        if request.user.is_authenticated:
            return render(request, "app.html", context)
        else:
            return render(request, "login.html", context)


class DependenciesAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id: str):
        try:
            project = Project.objects.get(project_id=project_id)
            dependency_serializer = DependencyBasicSerializer(project.dependency_set.all(), many=True)
            return Response(dependency_serializer.data)

        except MissingRequiredParameter as mrp:
            return mrp.create_response_object()
        except Project.DoesNotExist:
            return NotFoundError(f"Project with Id: {project_id},").create_response_object()
        except APIException as api_ex:
            raise api_ex
        except Exception as e:
            log_internal_error(logger, request, e)
            return InternalServerError().create_response_object()


class APIKey(APIView):
    permission_classes = [IsAuthenticated, permission_required("analyzer.change_project")]

    def post(self, request, project_id):
        try:
            project_manager = ProjectManager(project_id)
            return Response(project_manager.generate_key())

        except Project.DoesNotExist:
            return NotFoundError(project_id).create_response_object()
        except APIException as api_ex:
            raise api_ex
        except Exception as e:
            log_internal_error(logger, request, e)
            return InternalServerError().create_response_object()


class UpdateCVEAPI(APIView):
    permission_classes = [IsAuthenticated, permission_required("analyzer.change_cveobject")]

    def put(self, request, request_type: str, **kwargs):
        cve_objects = None
        try:
            match request_type:
                case "single":
                    cve_id = kwargs["cve_id"]
                    cve_objects = CVEObject.objects.get(cve_id=cve_id)
                case "project":
                    project_id = kwargs["project_id"]
                    project = Project.objects.get(project_id=project_id)
                    cve_objects = CVEObject.objects.filter(report__dependency__project=project)
                case "all":
                    cve_objects = CVEObject.objects.all()

            CVEObjectManager(cve_objects).update_cve()
            return Response(data="Update successful")

        except CVEObject.DoesNotExist:
            return NotFoundError(f"CVE with ID: {kwargs['cve_id']}")
        except KeyError as ke:
            return MissingRequiredParameter(ke.args[0]).create_response_object()
        except APIException as api_ex:
            log_internal_error(logger, request, traceback.format_exc())
            raise api_ex
        except Exception as e:
            log_internal_error(logger, request, e)
            return InternalServerError().create_response_object()


class UnknownPage(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            logger.warning(
                f"User: {hash_string(word=request.user.username, salt=SALT)}"
                f"({request.META.get('HTTP_X_FORWARDED_FOR')}) tried to access {request.META.get('HTTP_REFERER')} "
                f"but no resource was found.")
        else:
            logger.warning(
                f"Unknown user with IP:{request.META.get('HTTP_X_FORWARDED_FOR')} tried to access "
                f"{request.GET.get('HTTP_REFERER')} but no resource was found.")
        return Response(data="Unknown resource")
