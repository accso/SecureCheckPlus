#!/usr/bin/env bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BASE_DIR=$(realpath $SCRIPT_DIR/..)

# Check if the VIRTUAL_ENV environment variable is set
if [[ -z "$VIRTUAL_ENV" ]]; then
    echo "No virtual environment is active. Please activate one before proceeding."
    exit 1
else
    echo "Using virtual environment: $VIRTUAL_ENV"
fi


REQUIREMENTS=$BASE_DIR/backend/requirements.txt
pip install -r $REQUIREMENTS
