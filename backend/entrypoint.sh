#!/bin/sh

echo "Waiting for postgres..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do sleep 1; done;
echo "PostgreSQL started"

python manage.py createcachetable rate_limit
python manage.py makemigrations
python manage.py migrate

# Collect Django admin staticfiles (not frontend assets - those are served by Nginx in the frontend container)
python manage.py collectstatic --no-input

exec "$@"
