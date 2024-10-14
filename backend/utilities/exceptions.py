from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_403_FORBIDDEN, \
    HTTP_500_INTERNAL_SERVER_ERROR, HTTP_401_UNAUTHORIZED, HTTP_204_NO_CONTENT


class ViewException(Exception):
    """Base class for all exceptions which should be forwarded to the client.

    :param: status_code: The HTTP error code.
    :type: status_code: int
    :param: default_detail: A detailed description of the exception.
    :type: default_detail: str
    """

    def __init__(self, status_code, default_detail):
        self.status_code = status_code
        self.detail = default_detail

    def __str__(self):
        return str(self.detail)

    def get_status_code(self):
        return self.status_code

    def get_detail(self):
        return self.detail

    def create_response_object(self):
        """Creates a response object to display the error to the client.

        :return: A response object containing information about the exception.
        :rtype: Response
        """
        return Response(data=self.get_detail(), status=self.get_status_code())


class NoDependenciesFound(ViewException):
    """Raises if no dependencies were found.
    Status code: 204"""

    def __init__(self, project_id: str = ""):
        super().__init__(HTTP_204_NO_CONTENT,
                         f"No dependencies were found for project {project_id}.")


class UnsupportedReportTool(ViewException):
    """Raises if unsupported report tool name is given via query parameter.
    Status code: 400"""

    def __init__(self, tool_name: str = ""):
        super().__init__(HTTP_400_BAD_REQUEST, f"Unsupported report tool: {tool_name}")


class UnsupportedReportFileType(ViewException):
    """Raises if unsupported report file type is given via query parameter.
    Status code: 400"""

    def __init__(self, file_type: str = ""):
        super().__init__(HTTP_400_BAD_REQUEST, f"Unsupported report file type: {file_type}.")


class MissingRequiredParameter(ViewException):
    """Raises when important parameter are missing. E.g. fileType, toolName and projectId and Api-Key.
    Status code: 400"""

    def __init__(self, missing_parameter: str = ""):
        super().__init__(HTTP_400_BAD_REQUEST,
                         f"The following required parameter is missing: {missing_parameter}.")


class ParseError(ViewException):
    """Raises if the given file can't be parsed.
    Status code: 400"""

    def __init__(self, message):
        super().__init__(HTTP_400_BAD_REQUEST, message)


class Unauthorized(ViewException):
    """Raises when API-Key or Credentials is invalid.
    Status code: 401"""

    def __init__(self, message="Not authenticated or authentication failed."):
        super().__init__(HTTP_401_UNAUTHORIZED, message)


class InvalidValueError(ViewException):
    """Raises when the value given is invalid."""

    def __init__(self, value: str = ""):
        super().__init__(HTTP_400_BAD_REQUEST, f"The given value: {value} is invalid.")


class AccessDenied(ViewException):
    """Raises if authenticated but permission requirements not met.
    Status code: 403"""

    def __init__(self, message="Not enough permission. Access denied."):
        super().__init__(HTTP_403_FORBIDDEN, message)


class InternalServerError(ViewException):
    """Raises when an internal server error occurred.
    Status code: 500"""

    def __init__(self, message="An internal server error occurred for more information look up the logs or if you are "
                               "the admin look up in the log section."):
        super().__init__(HTTP_500_INTERNAL_SERVER_ERROR, message)


class SeverityThresholdReached(ViewException):
    """Raises when the deployment threshold has been exceeded.
    Status code: 406"""

    def __init__(self, threshold=""):
        super().__init__(406, f"Analysis was successful but the threshold: {threshold} for the severity in "
                              f"vulnerabilities has been reached.")


class NotFoundError(ViewException):
    """Raises when object could not be found/does not exist.
    Status code: 404"""

    def __init__(self, entity=""):
        super().__init__(404, f"{entity} could not be found.")


class AlreadyExists(ViewException):
    """Raises when object already exists.
    Status code: 400"""

    def __init__(self, entity=""):
        super().__init__(400, f"{entity} already exists.")

