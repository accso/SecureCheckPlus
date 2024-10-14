import codecs

from django.conf import settings
from rest_framework.exceptions import ParseError
from rest_framework.parsers import BaseParser


class CustomTextParser(BaseParser):
    """
    Base parser for text-based content types.
    Subclasses should specify the media_type and can override parse_text method.
    """
    media_type = None  # Subclasses should specify this

    def parse(self, stream, media_type=None, parser_context=None):
        parser_context = parser_context or {}
        encoding = parser_context.get("encoding", settings.DEFAULT_CHARSET)

        try:
            stream_decoder = codecs.getreader(encoding=encoding)(stream)
            return self.parse_text(stream_decoder)
        except ValueError as ve:
            raise ParseError("Error while parsing: " + str(ve))

    def parse_text(self, stream_decoder):
        """
        Parses the content of the stream as text.
        Subclasses can override this method for custom parsing.
        """
        return stream_decoder.read()


class PlainTextParser(CustomTextParser):
    """
    Parses the request body as plain text.
    Raises ParseError if the given body could not be parsed.
    """
    media_type = "text/plain"


class XMLParser(CustomTextParser):
    """
    Parses the request body as XML.
    Raises ParseError if the given body could not be parsed.
    """
    media_type = "application/xml"
