#!/usr/bin/env bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BASE_DIR=$(realpath "$SCRIPT_DIR/..")

ENV_FILE=$BASE_DIR/backend/.env

if [[ "$1" == "" ]] ; then
  echo "No scan report file given! Example files can be found at $BASE_DIR/backend/analyzer/test/data"
  exit 1
fi

if [[ ! -f $ENV_FILE ]]; then
    echo "No environment file $ENV_FILE found!"
    exit 2
fi

echo "Sourcing environment $ENV_FILE..."
. $ENV_FILE

SCANFILE=$1
SCANFILE_BASENAME=$(basename $SCANFILE)
SCANFILE_REALPATH=$(realpath $SCANFILE)

echo "Calling adapter for scan report file ${SCANFILE_BASENAME} at ${SCANFILE_REALPATH}..."

docker run -t --rm \
           -e SERVER_URL="$SERVER_URL/analyzer/api" \
           -e REPORT_FILE_NAME=${SCANFILE_BASENAME} \
           -e FILE_FORMAT=${FILE_FORMAT:-json} \
           -e TOOL_NAME=${TOOL_NAME:-owasp}\
           -e PROJECT_ID=${PROJECT_ID} \
           -e API_KEY="${API_KEY}" \
           -v "${SCANFILE_REALPATH}:/tmp/${SCANFILE_BASENAME}" \
           accso/secure-check-plus-adapter:latest
