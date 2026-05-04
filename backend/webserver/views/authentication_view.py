import logging

from django.contrib import auth
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from utilities.exceptions import Unauthorized, MissingRequiredParameter, InternalServerError
from utilities.helperclass import log_internal_error

logger = logging.getLogger(__name__)


@method_decorator(ensure_csrf_cookie, name="get")
class Login(APIView):
    permission_classes = []
    throttle_scope = "login"

    def get(self, request):
        return Response(data="CSRF cookie set")

    def post(self, request):
        try:
            username = request.data["username"]
            password = request.data["password"]
            keepMeLoggedIn = request.data["keepMeLoggedIn"]

            user = auth.authenticate(request=request,
                                     username=username,
                                     password=password)
            if user is not None:
                auth.login(request, user)
                if not keepMeLoggedIn:
                    request.session.set_expiry(0)
                return Response(data="Login successful!")
            else:
                logger.info(f"{username} {request.META.get('HTTP_X_FORWARDED_FOR')} failed to authenticate.")
                return Unauthorized().create_response_object()

        except KeyError as ke:
            return MissingRequiredParameter(ke.args[0]).create_response_object()
        except APIException as api_ex:
            raise api_ex
        except Exception as e:
            log_internal_error(logger, request, e)
            return InternalServerError().create_response_object()


class Logout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            auth.logout(request)
            return Response(data="Logout successful")

        except APIException as api_ex:
            raise api_ex
        except Exception as e:
            log_internal_error(logger, request, e)
            return InternalServerError().create_response_object()
