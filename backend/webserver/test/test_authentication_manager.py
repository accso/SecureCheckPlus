import os

import pytest
from unittest.mock import patch

from django.contrib import auth
from django.contrib.auth.models import AnonymousUser
from django.contrib.sessions.backends.db import SessionStore
from rest_framework.test import APIRequestFactory

from utilities.exceptions import Unauthorized
from securecheckplus.settings import IS_DEV
from webserver.models import User


@pytest.mark.django_db()
class TestAuthentication:

    @patch("securecheckplus.settings.LDAP_HOST", None)
    def test_valid_authentication(self):
        user = auth.authenticate(username=os.environ["ADMIN_USERNAME"], password=os.environ["ADMIN_PASSWORD"])
        assert not IS_DEV or user == User.objects.get(username=os.environ["ADMIN_USERNAME"])

    def test_invalid_authentication(self):
        user = auth.authenticate(username="invalid", password="invalid")
        assert user is None or IS_DEV

    def test_missing_password(self):
        if not IS_DEV:
            with pytest.raises(Unauthorized):
                auth.authenticate(username="admin", password=None)

    def test_login(self):
        request = APIRequestFactory().get("/")
        user = User.objects.create(username="TestUser")
        request.session = SessionStore()
        request.user = user
        auth.login(request, user)
        assert auth.get_user(request) == user

        auth.logout(request)
        assert isinstance(auth.get_user(request), AnonymousUser)

    @patch("securecheckplus.settings.LDAP_HOST", None)
    def test_update_group(self):
        user = User.objects.create(username="TestUser")
        group = Group.objects.create(name="basic")
        user.groups.add(group)
        update_group(user, [LDAP_BASE_GROUP_DN])
        assert user.groups.filter(name="basic").exists()

    @patch("securecheckplus.settings.LDAP_HOST", None)
    def test_authenticate_with_ldap(self):
        with patch("webserver.manager.ldap_adapter.LdapAdapter.authenticate_user", return_value=[LDAP_BASE_GROUP_DN]):
            user = auth.authenticate(username="ldap_user", password="ldap_password")
            assert user is not None
            assert user.username == "ldap_user"
            assert user.groups.filter(name="basic").exists()

    @patch("securecheckplus.settings.LDAP_HOST", None)
    def test_authenticate_with_invalid_ldap(self):
        with patch("webserver.manager.ldap_adapter.LdapAdapter.authenticate_user", return_value=None):
            user = auth.authenticate(username="invalid_ldap_user", password="invalid_ldap_password")
            assert user is None
