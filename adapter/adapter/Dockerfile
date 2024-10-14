FROM python:3.12.6-alpine3.20
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /tmp
COPY . /tmp
RUN pip install -r requirements.txt
ENTRYPOINT ["python", "run.py"]