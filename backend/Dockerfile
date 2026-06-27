FROM python:3.12.6-alpine3.20 AS dev
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV BASE_URL=""

WORKDIR /backend

COPY ./requirements.txt /backend
COPY ./entrypoint.sh /entrypoint.sh

#Remove windows carriage returns
RUN sed -i 's/\r$//' /entrypoint.sh

RUN apk update --no-cache \
    && apk upgrade --no-cache \
    && pip install --root-user-action ignore --upgrade pip \
    && pip install --root-user-action ignore -r requirements.txt

ENTRYPOINT ["sh", "/entrypoint.sh"]

CMD python manage.py runserver 0.0.0.0:8000

FROM dev as prod
#ARG is required for the settings.py. Otherwise the build will fail, because required env variables have not been set
ARG BUILD=1

COPY . /backend

RUN adduser -D -u 1000 baseuser && chown -R baseuser .
USER baseuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/check_health', timeout=2).read()" || exit 1

# Overwrites previous CMD from stage "dev"
CMD ["sh", "-c", "exec gunicorn securecheckplus.wsgi:application --bind 0.0.0.0:8000 --workers=${GUNICORN_WORKERS:-2} --threads=${GUNICORN_THREADS:-2} --log-level ${LOG_LEVEL:-INFO}"]
