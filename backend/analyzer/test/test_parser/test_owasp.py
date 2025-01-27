from unittest import TestCase

from analyzer.parser import owasp_parser
from analyzer.test.fixtures import TRUE_DATA
from analyzer.test.fixtures import get_owasp_json

class JSONTest(TestCase):
    def test_valid_json(self):
        json_string = get_owasp_json()
        self.assertEqual(TRUE_DATA, owasp_parser.parse_json(json_string))

    def test_invalid_json(self):
        invalid_json_string = '{"invalid": "json"}'
        with self.assertRaises(KeyError):
            owasp_parser.parse_json(invalid_json_string)

    def test_empty_json(self):
        empty_json_string = '{}'
        with self.assertRaises(KeyError):
            owasp_parser.parse_json(empty_json_string)
