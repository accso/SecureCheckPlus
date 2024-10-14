from rest_framework import permissions
from rest_framework.permissions import BasePermission

from utilities.exceptions import AccessDenied


def permission_required(permission_name: str, raise_exception=False):
    """A permission class for the view. Checks whether a user has
    enough permission to access the specified API.

    :param permission_name: A permission defined as in the django docs.
    :type permission_name: str
    :param raise_exception: A boolean whether an exception should be raised if required permissions are not met
                            This can usually be false as djangorestframework automatically returns an API exception
                            if requirements are not met.
    :type raise_exception: bool
    ...
    :raises AccessDenied: Raises if permission requirements are not met.
    ...
    :return: A class which can be passed to permission_classes in class based views.
    :rtype: class
    """

    class PermissionRequired(permissions.BasePermission):
        def has_permission(self, request, view):
            if not request.user.has_perm(permission_name):
                if raise_exception:
                    raise AccessDenied
                return False
            return True

    return PermissionRequired


class IsPut(BasePermission):
    """
    Check if is a put request
    """

    def has_permission(self, request, view):
        return request.method == "PUT"


class IsPost(BasePermission):
    """
    Check if is a post request
    """

    def has_permission(self, request, view):
        return request.method == "POST"


class IsGet(BasePermission):
    """
    Check if is a get request
    """

    def has_permission(self, request, view):
        return request.method == "GET"
