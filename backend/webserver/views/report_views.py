import logging

from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from analyzer.models import Project, Report
from utilities.exceptions import MissingRequiredParameter, NotFoundError, InternalServerError
from utilities.helperclass import log_internal_error
from webserver.manager.authorization_manager import permission_required, IsGet, IsPut
from webserver.serializer.report_serializer import ReportSummarySerializer, ReportDetailSerializer

logger = logging.getLogger(__name__)


class ReportsAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id: str):
        try:
            project = Project.objects.get(project_id__iexact=project_id)
            reports = Report.objects.filter(dependency__project=project)
            report_serializer = ReportSummarySerializer(reports, many=True)
            data = {"projectId": project_id,
                    "projectName": project.project_name,
                    "vulnerabilities": report_serializer.data}
            return Response(data=data)

        except MissingRequiredParameter as mrp:
            return mrp.create_response_object()
        except Project.DoesNotExist:
            return NotFoundError(f"Project with Id: {project_id},").create_response_object()
        except APIException as api_ex:
            raise api_ex
        except Exception as e:
            log_internal_error(logger, request, e)
        return InternalServerError().create_response_object()


class ReportAPI(APIView):
    permission_classes = [IsAuthenticated, IsGet | (IsPut & permission_required("analyzer.change_report"))]

    def get(self, request, **kwargs):
        try:
            project = Project.objects.get(project_id__iexact=kwargs["project_id"])
            report = Report.objects.filter(dependency__project=project).all()
            report = report.get(id=kwargs["report_id"])
            report_serializer = ReportDetailSerializer(report)
            data = {"projectId": report.dependency.project.project_id,
                    "projectName": report.dependency.project.project_name,
                    "dependencyName": report.dependency.dependency_name,
                    "dependencyVersion": report.dependency.version,
                    "packageManager": report.dependency.package_manager,
                    "report": report_serializer.data}
            return Response(data=data)

        except MissingRequiredParameter as mrp:
            return mrp.create_response_object()
        except Project.DoesNotExist:
            return NotFoundError(f"Project with id {kwargs['project_id']}").create_response_object()
        except Report.DoesNotExist:
            return NotFoundError(f"Report with id: {kwargs['report_id']}").create_response_object()
        except Exception as e:
            log_internal_error(logger, request, e)
            return InternalServerError().create_response_object()

    def put(self, request, **kwargs):
        try:
            project = Project.objects.get(project_id__iexact=kwargs["project_id"])
            report = Report.objects.filter(dependency__project=project).all()
            report = report.get(id=kwargs["report_id"])

            data = request.data
            report_serializer = ReportDetailSerializer(report, data)
            if report_serializer.is_valid():
                report_serializer.save()
                report.user = request.user
                report.save()
            else:
                raise APIException

            return Response(data="Update of report successful.")

        except KeyError as ke:
            return MissingRequiredParameter(ke.args[0]).create_response_object()
        except Project.DoesNotExist:
            return NotFoundError(f"Project with id {kwargs['project_id']}").create_response_object()
        except Report.DoesNotExist:
            return NotFoundError(f"Report with id {kwargs['report_id']}").create_response_object()
        except APIException as api_ex:
            raise api_ex
        except Exception as e:
            log_internal_error(logger, request, e)
            return InternalServerError().create_response_object()
