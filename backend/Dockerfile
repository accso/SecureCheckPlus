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
    && pip install --upgrade pip \
    && pip install --root-user-action ignore -r requirements.txt

ENTRYPOINT ["sh", "/entrypoint.sh"]

CMD python manage.py runserver 0.0.0.0:8000

FROM dev as prod
#ARG is required for the settings.py. Otherwise the build will fail, because required env variables have not been set
ARG BUILD=1

COPY . /backend

RUN adduser -D baseuser && chown -R baseuser .
USER baseuser

EXPOSE 8000

# Overwrites previous CMD from stage "dev"
#CMD gunicorn securecheckplus.wsgi:application --bind 0.0.0.0:8000 --workers=2 --threads=2 --log-level INFO
