FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for build/runtime if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .
COPY src/ ./src/

EXPOSE 5000

CMD ["python", "app.py"]
