import logging
import re

from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from utilities.exceptions import InvalidValueError, InternalServerError, \
  MissingRequiredParameter, NotFoundError, \
  AlreadyExists
from utilities.helperclass import log_internal_error
from webserver.manager.authorization_manager import permission_required, IsGet, \
  IsPut, IsPost
from webserver.models import UserWatchProject, Project
from webserver.serializer.project_serializer import ProjectSummarySerializer, \
  ProjectMinimalSerializer, \
  ProjectDetailSerializer, ProjectBasicSerializer

logger = logging.getLogger(__name__)


class DeleteProjectAPI(APIView):
  def post(self, request) -> Response:
    try:
      projectIds = request.data["projectIds"]
      for projectId in projectIds:
        targetProject = Project.objects.get(project_id=projectId)
        targetProject.delete()

      return Response(data="Deleted successful")
    except Exception as e:
      log_internal_error(logger, request, e)
      return InternalServerError().create_response_object()


class ProjectsFlatAPI(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    try:
      project_serializer = ProjectMinimalSerializer(Project.objects.all(),
                                                    many=True)
      return Response(data=project_serializer.data)

    except APIException as api_ex:
      raise api_ex
    except Exception as e:
      log_internal_error(logger, request, e)
      return InternalServerError().create_response_object()


class ProjectsAPI(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request):
    try:
      project_filter = request.GET.get("filter")
      page_index = int(request.GET.get("pageIndex")) or 0
      page_size = int(
        request.GET.get("pageSize")) or Project.objects.all().count()
      data = {}

      match project_filter:
        case "allProjects":
          projects = Project.objects.order_by("project_id")[
                     page_size * page_index: (page_index + 1) * page_size]
        case "recentProjects":
          projects = request.user.recent_projects()[
                     page_size * page_index: (page_index + 1) * page_size]
        case "favoriteProjects":
          projects = request.user.favorite_projects()[
                     page_size * page_index: (page_index + 1) * page_size]
        case _:
          raise InvalidValueError(f"Unknown filter {project_filter}")

      if len(projects) < page_size - 1:
        data["properties"] = {"last_page": True,
                              "next_page": -1}
      else:
        data["properties"] = {"last_page": False,
                              "next_page": page_index + 1}

      project_serializer = ProjectSummarySerializer(projects, many=True)
      data["projects"] = project_serializer.data

      return Response(data=data)

    except ValueError:
      return InvalidValueError().create_response_object()
    except InvalidValueError as iv:
      return iv.create_response_object()
    except APIException as api_ex:
      raise api_ex
    except Exception as e:
      log_internal_error(logger, request, e)
      return InternalServerError().create_response_object()


class ProjectAPI(APIView):
  permission_classes = [IsAuthenticated, IsGet |
                        (IsPut & permission_required(
                          "analyzer.change_project")) |
                        (IsPost & permission_required("analyzer.add_project"))
                        ]

  def get(self, request, project_id: str):
    try:
      project = Project.objects.get(project_id__iexact=project_id)

      # refreshes look up / recently watched
      user_watch_project = \
        UserWatchProject.objects.get_or_create(project=project,
                                               user=request.user)[0]
      user_watch_project.save()

      project_serializer = ProjectDetailSerializer(project)

      return Response(data=project_serializer.data)

    except Project.DoesNotExist:
      return NotFoundError(
        f"Project with Id: {project_id},").create_response_object()
    except APIException as api_ex:
      raise api_ex
    except Exception as e:
      log_internal_error(logger, request, e)
    return InternalServerError().create_response_object()

  def put(self, request, project_id: str):
    try:
      project = Project.objects.get(project_id__iexact=project_id)

      project_serializer = ProjectBasicSerializer(project, data=request.data,
                                                  partial=True)
      if project_serializer.is_valid():
        project_serializer.save()

      return Response(data=f"Update of Project: {project_id} successful.")
    except KeyError as ke:
      return MissingRequiredParameter(ke.args[0]).create_response_object()
    except Project.DoesNotExist:
      return NotFoundError(f"Project: {project_id},").create_response_object()
    except APIException as api_ex:
      raise api_ex
    except Exception as e:
      log_internal_error(logger, request, e)
      return InternalServerError().create_response_object()

  def post(self, request, project_id):
    try:
      if Project.objects.filter(project_id__iexact=project_id).exists():
        raise AlreadyExists(project_id)
      if len(project_id) >= 1 and re.search(r"^[\w-]+$", project_id):
        project = Project.objects.create(project_id=project_id)
        project_serializer = ProjectBasicSerializer(project, request.data)
        if project_serializer.is_valid():
          project_serializer.save()
      else:
        raise InvalidValueError(project_id)

      if len(request.data.get("projectName", "")) > 255:
        raise InvalidValueError("Project name exceeds the maximum length of 255 characters")

      return Response(f"Creation of {project_id} successful!")

    except AlreadyExists as ae:
      return ae.create_response_object()
    except KeyError as ke:
      return MissingRequiredParameter(ke.args[0]).create_response_object()
    except APIException as api_ex:
      log_internal_error(logger, request, api_ex)
      raise api_ex
    except Exception as e:
      log_internal_error(logger, request, e)
      return InternalServerError().create_response_object()
