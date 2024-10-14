import logging
from typing import Callable, Dict

from analyzer.parser import owasp_parser, trivy_parser, cyclonedx_parser
from analyzer.parser.types import ParseResult
from utilities.exceptions import UnsupportedReportFileType, UnsupportedReportTool, ParseError

logger = logging.getLogger(__name__)

ParseFunc = Callable[[str], Dict[str, ParseResult]]
ParseFuncDict = Dict[str, ParseFunc]

supported_formats: dict[str, ParseFuncDict] = {
    "owasp": {
        "json": owasp_parser.parse_json
    },
    "trivy": {
        "json": trivy_parser.parse_json
    },
    "cyclonedx": {
        "json": cyclonedx_parser.parse_json,
    }
}


class ParserManager:
    """Finds the correct parser to the corresponding inputs and verifies whether tool and filetype is correct."""

    def __init__(self, tool_name: str, file_type: str):
        """
        :param tool_name: The name of the tool used to generate the report.
        :param file_type: The file type of the report.
        """
        self.tool_name = tool_name.lower()
        self.file_type = file_type.lower()
        self.data = None

        self._verify_tool_name()
        self._verify_file_type()

    def parse(self, data: str or dict) -> dict[str, ParseResult]:
        """Parses the report and extracts data as a dictionary.

        :param data: The report as a string or dictionary.
        :return: A standardized dictionary with dependencies as keys and vulnerabilities as a list.
        """

        if len(data) == 0:
            raise ParseError("Empty body detected")

        tool_types = supported_formats.get(self.tool_name)
        parse_func = tool_types.get(self.file_type)
        parsed_data = parse_func(data)
        logger.info(f"Parsing was successful with tool name:{self.tool_name} and file type: {self.file_type}.")
        return parsed_data

    def _verify_tool_name(self):
        if self.tool_name in supported_formats.keys():
            return True
        else:
            raise UnsupportedReportTool(self.tool_name)

    def _verify_file_type(self):
        if self.file_type in supported_formats[self.tool_name].keys():
            return True
        else:
            raise UnsupportedReportFileType(self.file_type)
