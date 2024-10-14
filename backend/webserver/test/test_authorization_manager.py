
import pytest
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from rest_framework.test import APIRequestFactory
from rest_framework.views import APIView

from webserver.manager.authorization_manager import permission_required
from webserver.models import User


@pytest.mark.django_db()
class TestAuthorization:

    @pytest.fixture()
    def db(self):
        content_type = ContentType.objects.create(app_label="webserver", model="project")
        permission = Permission.objects.create(codename="view_project", content_type=content_type)
        advanced_permission = Permission.objects.create(codename="change_project", content_type=content_type)
        Group.objects.get_or_create(name="basic")[0].permissions.set([permission])
        Group.objects.get_or_create(name="admin")[0].permissions.set([permission, advanced_permission])
        self.basic_group = Group.objects.get(name="basic")
        self.admin_group = Group.objects.get(name="admin")
        self.user = User.objects.create(username="Basic User")
        self.user.groups.add(self.basic_group)
        self.user.save()
        self.request_content_type = "plain/text"

    def test_user_has_basic_group(self, db):
        assert list(self.user.groups.all().values_list("name", flat=True)) == ["basic"]

    def test_has_basic_permission(self, db):
        permission_manager = permission_required(permission_name="webserver.view_project")
        request = APIRequestFactory(enforce_csrf_checks=True).post("/", data="", content_type=self.request_content_type)
        request.user = self.user
        assert self.user.has_perm("webserver.view_project")
        assert permission_manager().has_permission(request=request, view=APIView.as_view())

    def test_access_denied(self, db):
        permission_manager = permission_required(permission_name="webserver.change_project")
        request = APIRequestFactory(enforce_csrf_checks=True).post("/", data="", content_type=self.request_content_type)
        request.user = self.user
        assert not permission_manager.has_permission(permission_manager, request, view=APIView.as_view())

    def test_have_access_after_group_change(self, db):
        permission_manager = permission_required(permission_name="webserver.change_project")
        request = APIRequestFactory(enforce_csrf_checks=True).post("/", data="", content_type=self.request_content_type)
        request.user = self.user
        self.user.groups.add(self.admin_group)
        self.user.save()
        assert permission_manager.has_permission(permission_manager, request, view=APIView.as_view())
