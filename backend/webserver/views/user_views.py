import logging

from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from analyzer.models import Project
from utilities.exceptions import InternalServerError, MissingRequiredParameter
from utilities.helperclass import log_internal_error
from webserver.models import UserWatchProject
from webserver.serializer.user_serializer import UserBasicSerializer, UserFavoriteProjectsSerializer

logger = logging.getLogger(__name__)


class UserDataAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_serializer = UserBasicSerializer(request.user)
            return Response(data=user_serializer.data)
        except Exception as e:
            log_internal_error(logger, request, e)
            return InternalServerError().create_response_object()

    def put(self, request):
        try:
            user_serializer = UserBasicSerializer(request.user, request.data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()
            return Response(data=f"Update of user settings from {request.user.username} successful.")

        except Exception as e:
            log_internal_error(logger, request, e)
            return InternalServerError().create_response_object()


class FavoriteProjectsAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_serializer = UserFavoriteProjectsSerializer(request.user)
            return Response(data=user_serializer.data)

        except Exception as ex:
            log_internal_error(logger, request, ex)
            return InternalServerError().create_response_object()

    def put(self, request):
        try:
            project_id = request.data["projectId"]
            project = Project.objects.get(project_id__iexact=project_id)
            user_watch_project = UserWatchProject.objects.get_or_create(project=project, user=request.user)[0]

            if user_watch_project.favorite:
                user_watch_project.favorite = False
            else:
                user_watch_project.favorite = True

            user_watch_project.save()
            return Response(data={"project_id": project_id, "user": request.user.username, "status": "Successful"})

        except KeyError as ke:
            return MissingRequiredParameter(ke.args[0]).create_response_object()
        except APIException as api_ex:
            raise api_ex
        except Exception as e:
            log_internal_error(logger, request, e)
            return InternalServerError().create_response_object()
