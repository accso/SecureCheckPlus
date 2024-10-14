from rest_framework import serializers

from analyzer.models import Dependency


class DependencyBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dependency
        fields = ["dependencyName", "dependencyInUse", "version", "packageManager", "license", "path"]

    dependencyName = serializers.CharField(source="dependency_name", read_only=True)
    dependencyInUse = serializers.BooleanField(source="in_use", read_only=True)
    version = serializers.CharField(read_only=True)
    packageManager = serializers.CharField(source="package_manager", read_only=True)
    path = serializers.CharField(read_only=True)


class DependencySummarySerializer(DependencyBasicSerializer):
    class Meta:
        model = Dependency
        fields = ["dependencyName", "dependencyInUse", "version", "packageManager"]
