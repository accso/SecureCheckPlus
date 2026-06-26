from unittest import TestCase
import json
import os

from analyzer.parser import trivy_parser
from analyzer.manager.parser_manager import ParserManager
from securecheckplus.settings import BASE_DIR


TRIVY_FIXTURE = os.path.join(BASE_DIR, "analyzer/test/data/trivy-report-securechecknext.json")


class TrivyJSONTest(TestCase):
    def test_parse_json_from_string(self):
        """Verify trivy parser handles JSON string input."""
        with open(TRIVY_FIXTURE) as f:
            json_string = f.read()
        result = trivy_parser.parse_json(json_string)
        self.assertIsInstance(result, dict)
        self.assertGreater(len(result), 0, "Should parse at least one dependency")

    def test_parse_json_from_dict(self):
        """Verify trivy parser handles dict input (as DRF request.data provides)."""
        with open(TRIVY_FIXTURE) as f:
            data = json.load(f)
        result = trivy_parser.parse_json(data)
        self.assertIsInstance(result, dict)
        self.assertGreater(len(result), 0, "Should parse at least one dependency")

    def test_parse_json_consistent_results(self):
        """Verify string and dict input produce identical results."""
        with open(TRIVY_FIXTURE) as f:
            json_string = f.read()
            f.seek(0)
            data = json.load(f)
        from_str = trivy_parser.parse_json(json_string)
        from_dict = trivy_parser.parse_json(data)
        self.assertEqual(set(from_str.keys()), set(from_dict.keys()))

    def test_via_parser_manager(self):
        """Verify trivy works through the ParserManager dispatch."""
        with open(TRIVY_FIXTURE) as f:
            data = json.load(f)
        mgr = ParserManager(tool_name="trivy", file_type="json")
        result = mgr.parse(data)
        self.assertGreater(len(result), 0)
        # Each result should have a vulnerability list
        for key, val in result.items():
            self.assertIsInstance(val.vulnerabilities, list)
