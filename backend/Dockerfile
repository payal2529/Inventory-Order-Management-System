FROM python:3.11-slim

WORKDIR /code

COPY requirements.txt /code/requirements.txt

# Install psycopg2 dependencies
RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

# Expose port for the app
EXPOSE 8000

# Start Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
