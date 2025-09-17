# Start script for Railway deployment

echo "Starting FastAPI application..."
echo "PORT: $PORT"

# Use Railway's PORT if available, otherwise default to 8000
PORT=${PORT:-8000}

echo "Starting uvicorn on port $PORT"
uvicorn main:app --host 0.0.0.0 --port $PORT