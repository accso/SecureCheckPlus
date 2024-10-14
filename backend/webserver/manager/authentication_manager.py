import logging
import os

import ldap3.core.exceptions
from django.contrib import auth
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import Group

from securecheckplus.settings import ADMIN_USERNAME, ADMIN_PASSWORD, USER_PASSWORD, USER_USERNAME, LDAP_HOST, LDAP_USER_BASE_DN, LDAP_ADMIN_GROUP_DN, LDAP_BASE_GROUP_DN, \
    LDAP_ADMIN_DN, LDAP_ADMIN_PASSWORD, LDAP_USER_SEARCH_FILTER
from utilities.exceptions import Unauthorized
from webserver.manager.ldap_adapter import LdapAdapter
from webserver.models import User

logger = logging.getLogger(__name__)


def login(request, user):
    auth.login(request=request, user=user)


def logout(request):
    auth.logout(request)


def update_group(user: User, ldap_groups: list[str]):
    for group in [(LDAP_ADMIN_GROUP_DN, "admin"), (LDAP_BASE_GROUP_DN, "basic")]:
        if group[0] in ldap_groups and not user.groups.filter(name=group[1]).exists():
            user.groups.add(Group.objects.get(name=group[1]))
            logger.info(f"Added {group[1]} group to {user.username}")
        elif group[0] not in ldap_groups and user.groups.filter(name=group[1]).exists():
            user.groups.remove(Group.objects.get(name=group[1]))
            logger.info(f"Removed {group[1]} group from {user.username}")


class AuthenticationBackend(ModelBackend):

    def authenticate(self, request, username=None, password=None, **kwargs):
        """Tries to authenticate the given credentials with an LDAP Server.
        If the bind was successful with given credentials, checks whether an account already
        exists. If not a new one will be created.

        :param request: The request from which the login request was initiated.
        :type request: Request
        :param username: The username to authenticate. In this case the username is an e-mail address.
        :type username: str
        :param password: The corresponding password to the username.
        :type password: str
        ...
        :raises LDAPPasswordIsMandatoryError: Raises if no password were given.
        :raises LDAPException: Raises if an unknown error occurred.
        ...
        :return: A User or None, depending on the authentication process. If it was successful a User will be returned.
        :rtype: User or None
        """

        username = username.lower()

        try:
            if LDAP_HOST:
                ldap_adapter = LdapAdapter(
                    host=LDAP_HOST, admin_dn=LDAP_ADMIN_DN, admin_password=LDAP_ADMIN_PASSWORD,
                    user_base_dn=LDAP_USER_BASE_DN, user_search_filter=LDAP_USER_SEARCH_FILTER
                )

                connection = ldap_adapter.admin_login()

                groups = ldap_adapter.authenticate_user(connection=connection, username=username, password=password)

                if groups is None:
                    return None

                try:
                    user = User.objects.get(username=username)
                    update_group(user, groups)

                except User.DoesNotExist:
                    user = User.objects.create(username=username)
                    user.groups.add(Group.objects.get_or_create(name="basic")[0])
                    update_group(user=user, ldap_groups=groups)
                    user.save()

                if user.groups.filter(name="basic").exists() or user.groups.filter(name="admin").exists():
                    return user
                else:
                    logger.warning(f"User '{username}' is not a member of required groups!")
                    return None

            elif ADMIN_USERNAME and ADMIN_PASSWORD and ADMIN_USERNAME == username and ADMIN_PASSWORD == password:
                user = User.objects.get_or_create(username=username)[0]
                user.groups.add(Group.objects.get_or_create(name="admin")[0])
                return user

            elif USER_USERNAME and USER_PASSWORD and USER_USERNAME == username and USER_PASSWORD == password:
                user = User.objects.get_or_create(username=username)[0]
                return user

            return None

        except ldap3.core.exceptions.LDAPPasswordIsMandatoryError:
            raise Unauthorized

        except ldap3.core.exceptions.LDAPException as ldap_ex:
            logger.error(ldap_ex)
            raise Unauthorized

    def get_user(self, user_id):
        try:
            user = User.objects.get(id=user_id)
            return user
        except User.DoesNotExist:
            return None
