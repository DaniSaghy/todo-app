# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend directory
COPY backend/ .

# Expose port
EXPOSE 8000

# Start the FastAPI application directly
CMD ["bash", "-c", "echo 'Starting FastAPI application...' && echo 'PORT: $PORT' && PORT=${PORT:-8000} && echo 'Starting uvicorn on port $PORT' && uvicorn main:app --host 0.0.0.0 --port $PORT"]
