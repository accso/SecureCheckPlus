import logging
import os
import sys

import requests

from read_file import get_file_as_string

logger = logging.getLogger(__file__)
logging.basicConfig(encoding='utf-8', level=logging.DEBUG)

try:
    API_KEY = os.environ["API_KEY"]
    FILE_FORMAT = os.environ["FILE_FORMAT"]
    TOOL_NAME = os.environ["TOOL_NAME"]
    PROJECT_ID = os.environ["PROJECT_ID"]
    SERVER_URL = os.environ["SERVER_URL"]
    REPORT_FILE_NAME = os.environ["REPORT_FILE_NAME"]
    SKIP = os.getenv("SKIP", "false")
    CI_PROJECT_DIR = os.getenv("CI_PROJECT_DIR", "/tmp")

    if SKIP.lower() == "true":
        logger.warning(f"Skipped SecureCheckPlus!")
        sys.exit(0)

    headers = {"API-KEY": API_KEY,
               "content-type": "text/plain"}
    query_params = {"fileType": FILE_FORMAT,
                    "toolName": TOOL_NAME,
                    "projectId": PROJECT_ID}

    response = requests.post(url=SERVER_URL,
                             data=get_file_as_string(filename=REPORT_FILE_NAME, file_dir=CI_PROJECT_DIR).encode("utf-8"),
                             params=query_params,
                             headers=headers)

    if response.status_code in [200, 204]:
        logger.info(f"Upload was successful, with the following response: {response.text}.")
        sys.exit(0)
    elif response.status_code == 406:
        logger.warning(f"Upload successful! But deployment requirements are not met. "
                       f"Response: {response.text}.")
        sys.exit(-1)
    else:
        logger.warning(f"Upload failed! Webserver response code was {response.status_code} with the following "
                       f"response: {response.text}.")
        sys.exit(-1)

except KeyError as ke:
    logger.error(f"Following parameter is missing: {ke.args[0]}")
    sys.exit(-1)
except requests.ConnectionError as ce:
    logger.error(f"Connection to SecureCheckPlus Server failed... {ce}")
    sys.exit(-1)
except Exception as ex:
    logger.error(f"An unknown exception occurred: {ex}")
    sys.exit(-1)
