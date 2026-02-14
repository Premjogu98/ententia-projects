FROM python:3.10-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    librdkafka-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip

WORKDIR /home/ententia/code

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

RUN useradd -ms /bin/bash ententia
USER ententia

COPY --chown=ententia:ententia . .

ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["gunicorn", "v1:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]