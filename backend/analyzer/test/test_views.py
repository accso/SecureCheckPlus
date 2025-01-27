import pytest
from rest_framework.test import APIRequestFactory

from analyzer.manager.project_manager import ProjectManager
from analyzer.models import Project
from analyzer.test.fixtures import get_owasp_json
from analyzer.views import AnalyzeReport


@pytest.mark.django_db()
class TestViews:

    @pytest.fixture()
    def setup(self):
        self.client = APIRequestFactory(enforce_csrf_checks=True)
        self.project = Project.objects.create(project_id="TestProject")
        self.key = ProjectManager(self.project).generate_key()
        self.view = AnalyzeReport.as_view()
        self.report = get_owasp_json()
        self.correct_url = "/analyzer/api?fileType=json&toolName=owasp&projectId=TestProject&projectName=Demo" \
                           "&deploymentThreshold=HIGH"
        self.content_type = 'application/json'

    def test_correct_post(self, setup):
        request = self.client.post(self.correct_url, data=self.report, content_type=self.content_type,
                                   HTTP_API_KEY=self.key)

        response = self.view(request)
        assert response.status_code == 406
        try:
            Project.objects.get(project_id="TestProject")
            assert True
        except Project.DoesNotExist:
            assert False

    def test_unsupported_file_type(self, setup):
        request = self.client.post(
            "/analyzer/api?fileType=invalid&toolName=owasp&projectId=TestProject&projectName=Demo"
            "Project", data=self.report, content_type=self.content_type, HTTP_API_KEY=self.key)
        response = self.view(request)

        assert response.status_code == 400

    def test_unsupported_tool_type(self, setup):
        request = self.client.post(
            "/analyzer/api?fileType=json&toolName=invalid&projectId=TestProject&projectName=Demo"
            "Project", data=self.report, content_type=self.content_type, HTTP_API_KEY=self.key)
        response = self.view(request)

        assert response.status_code == 400

    def test_missing_key(self, setup):
        request = self.client.post(self.correct_url, data=self.report, content_type=self.content_type)
        response = self.view(request)

        assert response.status_code == 400

    def test_invalid_key(self, setup):
        request = self.client.post(self.correct_url, data=self.report, content_type=self.content_type,
                                   HTTP_API_KEY="invalidKey")
        response = self.view(request)

        assert response.status_code == 401

    def test_missing_parameter(self, setup):
        request = self.client.post(
            "/analyzer/api?fileType=json&projectId=TestProject&projectName=Demo"
            "Project", data=self.report, content_type=self.content_type, HTTP_API_KEY=self.key)
        response = self.view(request)

        assert response.status_code == 400

    def test_empty_report(self, setup):
        request = self.client.post(self.correct_url, data="", content_type=self.content_type, HTTP_API_KEY=self.key)
        response = self.view(request)

        assert response.status_code == 400

    def test_invalid_report(self, setup):
        request = self.client.post(self.correct_url, data="invalid", content_type=self.content_type,
                                   HTTP_API_KEY=self.key)
        response = self.view(request)

        assert response.status_code == 400

    def test_threshold_exception(self, setup):
        modified_url = "/analyzer/api?fileType=json&toolName=owasp&projectId=TestProject&projectName=Demo" \
                       "&deploymentThreshold=LOW"
        request = self.client.post(modified_url, data=self.report, content_type=self.content_type,
                                   HTTP_API_KEY=self.key)

        response = self.view(request)
        assert response.status_code == 406

    def test_health_endpoint(self, setup):
        request = self.client.get("/analyzer/health")
        response = self.view(request)
        assert response.status_code == 200
        assert response.content == b"I'm fine!"

    def test_analyze_report_with_no_dependencies(self, setup):
        empty_report = "{}"
        request = self.client.post(self.correct_url, data=empty_report, content_type=self.content_type,
                                   HTTP_API_KEY=self.key)
        response = self.view(request)
        assert response.status_code == 400
        assert b"No dependencies found" in response.content

    def test_analyze_report_with_internal_server_error(self, setup):
        request = self.client.post(self.correct_url, data=self.report, content_type=self.content_type,
                                   HTTP_API_KEY=self.key)
        with pytest.raises(Exception):
            self.view(request)
