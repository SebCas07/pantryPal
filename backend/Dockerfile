FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --disable-pip-version-check -r requirements.txt

RUN addgroup --system app \
    && adduser --system --ingroup app --home /app app \
    && mkdir -p /app/instance \
    && chown app:app /app/instance

COPY --chown=app:app app ./app
COPY --chown=app:app wsgi.py .

USER app

EXPOSE 8080

CMD ["sh", "-c", "exec gunicorn --bind 0.0.0.0:${PORT:-8080} --workers 1 --threads 8 --timeout 0 wsgi:app"]
