import logging

from django.contrib import auth
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from rest_framework.exceptions import APIException
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from utilities.exceptions import Unauthorized, MissingRequiredParameter, InvalidValueError, InternalServerError
from utilities.helperclass import log_internal_error

logger = logging.getLogger(__name__)


class Login(APIView):
    permission_classes = []
    throttle_scope = "login"

    def post(self, request):
        try:
            username = request.data["username"]
            password = request.data["password"]
            keepMeLoggedIn = request.data["keepMeLoggedIn"]

            validate_email(username)
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

        except ValidationError:
            return InvalidValueError("E-Mail is invalid").create_response_object()
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
