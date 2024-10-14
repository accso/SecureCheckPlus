import logging
import traceback

from django.http import HttpResponse
from rest_framework.exceptions import APIException
from rest_framework.parsers import JSONParser
from rest_framework.renderers import StaticHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from analyzer.manager.parser_manager import ParserManager
from analyzer.manager.project_manager import ProjectManager
from analyzer.models import Project
from analyzer.services import threshold_check as threshold_check
from analyzer.services.custom_parser_classes import PlainTextParser, XMLParser
from utilities.exceptions import NoDependenciesFound, NotFoundError, MissingRequiredParameter, UnsupportedReportTool, \
    UnsupportedReportFileType, SeverityThresholdReached, InternalServerError, ParseError, Unauthorized

logger = logging.getLogger(__name__)


class AnalyzeReport(APIView):
    parser_classes = [JSONParser, XMLParser, PlainTextParser]
    renderer_classes = [StaticHTMLRenderer]

    def post(self, request) -> Response:
        logger.info(f"=============================REQUEST - START==================================")

        params = request.query_params
        project = None
        try:
            project = Project.objects.get(project_id__iexact=params["projectId"])

            key = request.META["HTTP_API_KEY"]

            project_manager = ProjectManager(project=project)

            if not project_manager.verify_key(key):
                raise Unauthorized

            file_type = params["fileType"]
            tool_name = params["toolName"]

            parser_manager = ParserManager(tool_name=tool_name, file_type=file_type)
            parsed_data = parser_manager.parse(data=request.data)

            if len(parsed_data) == 0:
                raise NoDependenciesFound(project.project_id)

            project_manager.update_project(parsed_data)

            if not threshold_check.is_deployable(project.project_id):
                threshold = project.deployment_threshold.capitalize()
                raise SeverityThresholdReached(threshold=threshold)

            return Response(
                f"Analysis successful for project: {project.project_id}. {len(parsed_data)} dependencies were found.")

        except KeyError as ke:
            return MissingRequiredParameter(missing_parameter=ke.args[0]).create_response_object()
        except Unauthorized as un:
            return un.create_response_object()
        except Project.DoesNotExist:
            return NotFoundError(params["projectId"]).create_response_object()
        except ParseError as pe:
            return pe.create_response_object()
        except UnsupportedReportTool as urp:
            return urp.create_response_object()
        except UnsupportedReportFileType as urft:
            logger.warning(f"File uploaded by {request.META.get('HTTP_REFERER')} has unsupported format")
            return urft.create_response_object()
        except SeverityThresholdReached as st:
            return st.create_response_object()
        except NoDependenciesFound as ndf:
            return ndf.create_response_object()
        except APIException as ap:
            logger.warning(f"Unknown error detected: {traceback.format_exc()}")
            raise ap
        except Exception as ex:
            logger.error(
                f"Unknown error detected: {str(ex)}-{traceback.format_exc()} called by {request.META.get('HTTP_REFERER')}")
            return InternalServerError().create_response_object()
        finally:
            logger.info(f"=============================REQUEST - END====================================")


def health_endpoint(request):
    return HttpResponse(content="I'm fine!", status=200)
