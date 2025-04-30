FROM python:3.12.6-alpine3.20 AS dev
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV BASE_URL=""

WORKDIR /backend

COPY ./requirements.txt /backend
COPY ./entrypoint.sh /entrypoint.sh

#Remove windows carriage returns
RUN sed -i 's/\r$//' /entrypoint.sh

# Install system dependencies including Java
RUN apk update --no-cache \
    && apk upgrade --no-cache \
    && apk add --no-cache \
        openjdk11 \
        wget \
        unzip \
    && pip install --root-user-action ignore --upgrade pip \
    && pip install --root-user-action ignore -r requirements.txt

# Install OWASP Dependency-Check
ENV DC_VERSION="8.4.0"
ENV DC_DIRECTORY="/opt/dependency-check"
ENV DATA_DIRECTORY="/usr/share/dependency-check/data"

# Erstelle Verzeichnisse und setze Berechtigungen
RUN mkdir -p ${DC_DIRECTORY} ${DATA_DIRECTORY} \
    && wget "https://github.com/jeremylong/DependencyCheck/releases/download/v${DC_VERSION}/dependency-check-${DC_VERSION}-release.zip" -O /tmp/dependency-check.zip \
    && unzip /tmp/dependency-check.zip -d ${DC_DIRECTORY} \
    && rm /tmp/dependency-check.zip \
    && ln -s ${DC_DIRECTORY}/dependency-check/bin/dependency-check.sh /usr/local/bin/dependency-check \
    && chmod +x ${DC_DIRECTORY}/dependency-check/bin/dependency-check.sh \
    && chmod -R 777 ${DATA_DIRECTORY}

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
