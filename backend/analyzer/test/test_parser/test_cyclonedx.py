from unittest import TestCase
import json
import os

from analyzer.parser import cyclonedx_parser
from analyzer.manager.parser_manager import ParserManager
from securecheckplus.settings import BASE_DIR


CYCLONEDX_FIXTURE = os.path.join(BASE_DIR, "analyzer/test/data/cyclonedx-report-securechecknext.json")


class CycloneDXJSONTest(TestCase):
    def test_parse_json_from_string(self):
        """Verify cyclonedx parser handles JSON string input."""
        with open(CYCLONEDX_FIXTURE) as f:
            json_string = f.read()
        result = cyclonedx_parser.parse_json(json_string)
        self.assertIsInstance(result, dict)
        self.assertGreater(len(result), 0, "Should parse at least one dependency")

    def test_parse_json_from_dict(self):
        """Verify cyclonedx parser handles dict input (regression test for dict-handling bug)."""
        with open(CYCLONEDX_FIXTURE) as f:
            data = json.load(f)
        result = cyclonedx_parser.parse_json(data)
        self.assertIsInstance(result, dict)
        self.assertGreater(len(result), 0, "Should parse at least one dependency")

    def test_parse_json_consistent_results(self):
        """Verify string and dict input produce identical results."""
        with open(CYCLONEDX_FIXTURE) as f:
            json_string = f.read()
            f.seek(0)
            data = json.load(f)
        from_str = cyclonedx_parser.parse_json(json_string)
        from_dict = cyclonedx_parser.parse_json(data)
        self.assertEqual(set(from_str.keys()), set(from_dict.keys()))

    def test_via_parser_manager(self):
        """Verify cyclonedx works through the ParserManager dispatch (regression test for dict crash)."""
        with open(CYCLONEDX_FIXTURE) as f:
            data = json.load(f)
        mgr = ParserManager(tool_name="cyclonedx", file_type="json")
        result = mgr.parse(data)
        self.assertGreater(len(result), 0)
        # Each result should have a vulnerability list
        for key, val in result.items():
            self.assertIsInstance(val.vulnerabilities, list)

    def test_with_existing_test_object_fixture(self):
        """Verify the original test_object fixture still parses (regression test)."""
        legacy_fixture = os.path.join(BASE_DIR, "analyzer/test/test_object/cyclonedx/report.json")
        if os.path.exists(legacy_fixture):
            with open(legacy_fixture) as f:
                data = json.load(f)
            result = cyclonedx_parser.parse_json(data)
            self.assertIsInstance(result, dict)
