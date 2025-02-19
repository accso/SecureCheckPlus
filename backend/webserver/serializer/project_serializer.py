from datetime import datetime

from rest_framework import serializers

from analyzer.models import Project
from utilities.constants import Status, Threshold


class ProjectBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["projectId", "projectName", "updated", "deploymentThreshold"]

    projectId = serializers.CharField(source="project_id", read_only=True)
    projectName = serializers.CharField(source="project_name", allow_blank=True)
    updated = serializers.DateTimeField(default=datetime.now(), read_only=True)
    deploymentThreshold = serializers.ChoiceField(source="deployment_threshold", choices=Threshold.names)


class ProjectDetailSerializer(ProjectBasicSerializer):
    class Meta:
        model = Project
        fields = ["projectId", "projectName", "updated", "deploymentThreshold",
                  "resolvedReportCount", "solutionDistribution", "statusDistribution", "dependencyCount",
                  "notEvaluated", "evaluated"]

    resolvedReportCount = serializers.ReadOnlyField(source="resolved_report_count")
    solutionDistribution = serializers.ReadOnlyField(source="solution_distribution")
    statusDistribution = serializers.ReadOnlyField(source="status_distribution")
    dependencyCount = serializers.ReadOnlyField(source="dependency_count")
    notEvaluated = serializers.SerializerMethodField(method_name="get_not_evaluated", read_only=True)
    evaluated = serializers.SerializerMethodField(method_name="get_evaluated", read_only=True)

    def get_not_evaluated(self, project: Project):
        return project.vulnerabilities_count([Status.REVIEW.name, Status.REVIEW_AGAIN.name])

    def get_evaluated(self, project: Project):
        return project.vulnerabilities_count([Status.THREAT.name, Status.THREAT_WIP.name])


class ProjectSummarySerializer(ProjectBasicSerializer):
    class Meta:
        model = Project
        fields = ["projectId", "projectName", "updated", "vulnerabilityCount",
                  "misconfigurationCount", "riskValue", "requirementsFulfilled"]

    vulnerabilityCount = serializers.SerializerMethodField(method_name="get_vulnerability_count", read_only=True)
    misconfigurationCount = serializers.ReadOnlyField(default=12, read_only=True)  # TODO upcoming feature
    riskValue = serializers.ReadOnlyField(default=5, read_only=True)  # TODO upcoming feature
    requirementsFulfilled = serializers.ReadOnlyField(default=True, read_only=True)  # TODO upcoming feature

    def get_vulnerability_count(self, project: Project):
        return project.vulnerabilities_count([Status.REVIEW.name,
                                              Status.REVIEW_AGAIN.name,
                                              Status.THREAT.name,
                                              Status.THREAT_WIP.name])


class ProjectMinimalSerializer(ProjectBasicSerializer):
    class Meta:
        model = Project
        fields = ["projectId", "projectName"]
