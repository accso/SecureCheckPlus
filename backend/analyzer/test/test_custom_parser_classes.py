import io

import pytest

from analyzer.services.custom_parser_classes import XMLParser, PlainTextParser


@pytest.mark.django_db()
class TestParser:
    @pytest.fixture()
    def setup(self):
        self.body = "<test></test>"
        self.stream = io.BytesIO(self.body.encode())

    def test_xml_correct_parse(self, setup):
        xml_parser = XMLParser()
        assert self.body == xml_parser.parse(stream=self.stream)

    def test_plain_text_correct_parse(self, setup):
        xml_parser = PlainTextParser()
        assert self.body == xml_parser.parse(stream=self.stream)

