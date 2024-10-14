from rest_framework import serializers

from analyzer.models import CVEObject
from utilities.constants import BaseSeverity, AttackVector, AttackComplexity, PrivilegesRequired, UserInteraction, \
    ConfidentialityImpact, IntegrityImpact, AvailabilityImpact, Scope


class CVEDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CVEObject
        fields = ["cveId", "baseSeverity", "cvss", "epss", "published", "updated", "description",
                  "attackVector", "attackComplexity", "privilegesRequired", "userInteraction", "confidentialityImpact",
                  "integrityImpact", "availabilityImpact", "scope", "recommendedUrl"]

    cveId = serializers.CharField(source="cve_id", read_only=True)
    baseSeverity = serializers.ChoiceField(source="base_severity", choices=BaseSeverity.names, read_only=True)
    cvss = serializers.DecimalField(read_only=True, decimal_places=1, max_digits=3)
    epss = serializers.FloatField(read_only=True)
    published = serializers.DateTimeField(read_only=True)
    updated = serializers.DateTimeField(read_only=True)
    description = serializers.CharField(read_only=True)
    attackVector = serializers.ChoiceField(source="attack_vector", read_only=True, choices=AttackVector.names)
    attackComplexity = serializers.ChoiceField(source="attack_complexity", read_only=True,
                                               choices=AttackComplexity.names)
    privilegesRequired = serializers.ChoiceField(source="privileges_required", read_only=True,
                                                 choices=PrivilegesRequired.names)
    userInteraction = serializers.ChoiceField(source="user_interaction", read_only=True, choices=UserInteraction.names)
    confidentialityImpact = serializers.ChoiceField(source="confidentiality_impact", read_only=True,
                                                    choices=ConfidentialityImpact.names)
    integrityImpact = serializers.ChoiceField(source="integrity_impact", read_only=True, choices=IntegrityImpact.names)
    availabilityImpact = serializers.ChoiceField(source="availability_impact", read_only=True,
                                                 choices=AvailabilityImpact.names)
    scope = serializers.ChoiceField(read_only=True, choices=Scope.names)
    recommendedUrl = serializers.CharField(source="recommended_url", read_only=True)


class CVESummarySerializer(CVEDetailSerializer):
    class Meta:
        model = CVEObject
        fields = ["cveId", "baseSeverity", "description", "cvss", "epss"]
