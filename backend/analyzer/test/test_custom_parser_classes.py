import io

import pytest

from analyzer.services.custom_parser_classes import XMLParser, PlainTextParser, CustomTextParser


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

    def test_custom_text_parser(self, setup):
        custom_parser = CustomTextParser()
        assert self.body == custom_parser.parse(stream=self.stream)

    def test_custom_text_parser_with_encoding(self, setup):
        custom_parser = CustomTextParser()
        parser_context = {"encoding": "utf-8"}
        assert self.body == custom_parser.parse(stream=self.stream, parser_context=parser_context)

    def test_custom_text_parser_parse_error(self, setup):
        custom_parser = CustomTextParser()
        invalid_stream = io.BytesIO(b"\x80\x81\x82")
        with pytest.raises(ParseError):
            custom_parser.parse(stream=invalid_stream)
