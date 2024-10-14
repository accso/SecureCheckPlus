from rest_framework import serializers

from utilities.constants import Threshold
from webserver.models import User


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "imageHash", "notificationThreshold", "groups"]

    username = serializers.CharField(read_only=True)
    imageHash = serializers.CharField(source="image_hash", allow_blank=True)
    notificationThreshold = serializers.ChoiceField(source="notification_threshold", choices=Threshold.names)
    groups = serializers.ReadOnlyField(source="group_list")


class UserFavoriteProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["favoriteProjects"]

    favoriteProjects = serializers.SerializerMethodField(method_name="get_favorite_as_list", read_only=True)

    def get_favorite_as_list(self, user: User) -> list[str]:
        return user.favorite_projects().all().values_list("project_id", flat=True)
