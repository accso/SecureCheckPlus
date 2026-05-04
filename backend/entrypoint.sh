#!/bin/sh
set -e

echo "Waiting for postgres..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do sleep 1; done;
echo "PostgreSQL started"

python manage.py createcachetable rate_limit
python manage.py migrate

# Collect Django admin staticfiles (not frontend assets - those are served by Nginx in the frontend container)
python manage.py collectstatic --no-input

# In dev/preview mode: seed a demo project so the dashboard is not empty on first start
if [ "$IS_DEV" = "True" ]; then
    python manage.py seed_preview_data
fi

exec "$@"
