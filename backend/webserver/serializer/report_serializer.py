from rest_framework import serializers

from analyzer.models import Report
from utilities.constants import Status, Solution, BaseSeverity
from webserver.serializer.cve_serializer import CVESummarySerializer, CVEDetailSerializer
from webserver.serializer.dependency_serializer import DependencySummarySerializer


class ReportCommonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ["id", "updated", "status", "solution", "comment", "cveObject", "dependency", "scoreMetricData",
                  "overallCvssScore", "overallCvssSeverity"]

    id = serializers.IntegerField(read_only=True)
    updated = serializers.DateTimeField(source="update_date", read_only=True)
    status = serializers.ChoiceField(choices=Status.names)
    solution = serializers.ChoiceField(choices=Solution.names)
    comment = serializers.CharField(allow_blank=True)
    user = serializers.CharField(allow_null=True)
    cveObject = CVESummarySerializer(source="cve_object", read_only=True)
    dependency = DependencySummarySerializer(read_only=True)
    scoreMetricData = serializers.CharField(source="score_metric_data")
    overallCvssScore = serializers.DecimalField(source="overall_cvss_score", decimal_places=1, max_digits=3,
                                                allow_null=True)
    overallCvssSeverity = serializers.ChoiceField(source="overall_cvss_severity", choices=BaseSeverity.names,
                                                  allow_null=True)


class ReportSummarySerializer(ReportCommonSerializer):
    class Meta:
        model = Report
        fields = ["id", "cveObject", "dependency", "status", "overallCvssScore", "overallCvssSeverity"]


class ReportDetailSerializer(ReportCommonSerializer):
    class Meta:
        model = Report
        fields = ["id", "updated", "status", "solution", "comment", "cveObject", "dependency", "scoreMetricData",
                  "overallCvssScore", "overallCvssSeverity"]

    cveObject = CVEDetailSerializer(source="cve_object", read_only=True)

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if instance.user is not None:
            representation["author"] = instance.user.username
        return representation
