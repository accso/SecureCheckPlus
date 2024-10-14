import pytest

from analyzer.manager.parser_manager import ParserManager
from analyzer.test.fixtures import TRUE_DATA, get_owasp_json
from utilities.exceptions import ParseError, UnsupportedReportFileType, UnsupportedReportTool


def test_supported_types():
    assert TRUE_DATA == ParserManager(tool_name="owasp", file_type="json").parse(get_owasp_json())


def test_invalid_types():
    with pytest.raises(UnsupportedReportTool):
        ParserManager(tool_name="awsd", file_type="xml").parse(get_owasp_json())

    with pytest.raises(UnsupportedReportFileType):
        ParserManager(tool_name="owasp", file_type="dasd").parse(get_owasp_json())

    with pytest.raises(UnsupportedReportFileType):
        ParserManager(tool_name="owasp", file_type="xml").parse(get_owasp_json())


def test_invalid_data_calls_message():
    with pytest.raises(ParseError):
        ParserManager(tool_name="owasp", file_type="json").parse("")
