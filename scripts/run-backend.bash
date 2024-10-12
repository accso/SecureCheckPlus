#!/usr/bin/env bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BASE_DIR=$(realpath "$SCRIPT_DIR/..")

# Check if the VIRTUAL_ENV environment variable is set
if [[ -z "$VIRTUAL_ENV" ]]; then
    echo "No virtual environment is active. Please activate one before proceeding."
    exit 1
else
    echo "Using virtual environment: $VIRTUAL_ENV"
fi

ENV_FILE=$BASE_DIR/backend/.env

if [[ ! -f $ENV_FILE ]]; then
    echo "No environment file $ENV_FILE found!"
    exit 2
fi

echo "Sourcing environment $ENV_FILE..."
. $ENV_FILE

echo "Waiting for postgres..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do sleep 1; done;

echo "PostgreSQL available"

cd "$BASE_DIR/backend" || exit 3

python manage.py createcachetable rate_limit
python manage.py migrate
python manage.py collectstatic --no-input

if [[ ${IS_DEV} == "true" ]] ; then
  python manage.py runserver
else
  gunicorn securecheckplus.wsgi:application --bind 0.0.0.0:8000 --workers=2 --threads=2 --log-level INFO
fi