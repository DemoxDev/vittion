FROM python:3.11-slim

WORKDIR /app

# apt-get removed to avoid DNS issues during build
# Using psycopg2-binary to avoid compilation dependencies

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]
