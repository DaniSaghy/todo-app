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

# Copy startup script
COPY start_backend.sh .

# Make startup script executable
RUN chmod +x start_backend.sh

# Expose port
EXPOSE 8000

# Start the FastAPI application
CMD ["./start_backend.sh"]
