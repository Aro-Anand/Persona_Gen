# Dockerfile (in project root for backend)
FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY main.py .
COPY prompt.py .
COPY Data/ ./Data/

# Expose port
EXPOSE 8080

# Run with Cloud Run's expected port
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]