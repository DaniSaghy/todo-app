# Backend - FastAPI Todo API

RESTful API backend for the Todo application with AI-powered task generation.

## Live Demo

- **API**: [https://todo-app-production-173e.up.railway.app/](https://todo-app-production-173e.up.railway.app/)
- **API Docs**: [https://todo-app-production-173e.up.railway.app/docs](https://todo-app-production-173e.up.railway.app/docs)
- **Frontend**: [https://danisaghy.github.io/todo-app/](https://danisaghy.github.io/todo-app/)

## Tech Stack

- **FastAPI** for the REST API
- **SQLAlchemy** for database ORM
- **SQLite** for data persistence
- **Pydantic** for data validation
- **Uvicorn** as ASGI server
- **LiteLLM** for AI provider abstraction

## Quick Start

### Prerequisites
- Python 3.11+

### Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Frontend**: http://localhost:3000 (make sure frontend is running)

### AI Features Setup
```bash
# Copy environment template
cp env.example .env

# Add your API keys to .env
# At least one of these is required:
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
COHERE_API_KEY=your_cohere_api_key_here
```

See [AI Integration Guide](../AI_INTEGRATION.md) for detailed setup.

## Project Structure

```
backend/
├── main.py              # FastAPI application entry point
├── ai_service.py        # AI integration service
├── requirements.txt     # Python dependencies
├── env.example          # Environment variables template
├── todos.db            # SQLite database (auto-created)
├── tests/              # Test suite
│   ├── test_main.py    # API endpoint tests
│   ├── test_ai_integration.py # AI service tests
│   ├── test_ai_real.py # Real AI API tests
│   └── test_priority.py # Priority functionality tests
└── README.md           # This file
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API health check |
| GET | `/todos` | Get all todos |
| POST | `/todos` | Create a new todo |
| GET | `/todos/{id}` | Get a specific todo |
| PUT | `/todos/{id}` | Update a todo |
| DELETE | `/todos/{id}` | Delete a todo |
| POST | `/todos/ai-generate` | Generate todo from natural language |

### Example API Usage

```bash
# Create a todo with priority
curl -X POST "http://localhost:8000/todos" \
     -H "Content-Type: application/json" \
     -d '{"title": "Learn FastAPI", "description": "Build awesome APIs", "priority": 2}'

# Get all todos
curl "http://localhost:8000/todos"

# Generate todo with AI
curl -X POST "http://localhost:8000/todos/ai-generate" \
     -H "Content-Type: application/json" \
     -d '{"user_input": "remind me to submit taxes next Monday"}'
```

## Testing

```bash
# Run all tests
pytest -v

# Run specific test files
pytest tests/test_main.py -v
pytest tests/test_ai_integration.py -v

# Run with coverage
pytest --cov=main --cov=ai_service -v

# Run only fast tests (exclude slow AI tests)
pytest -m "not slow" -v
```

## Deployment

The backend is deployed to Railway:

1. **Automatic deployment** on push to main
2. **Live at**: https://todo-app-production-173e.up.railway.app/
3. **Database**: SQLite with persistent storage

See [Railway Deployment Guide](../GITHUB_PAGES_DEPLOYMENT.md) for details.

## Configuration

### Environment Variables
- `DATABASE_URL`: Database connection string (default: SQLite)
- `GOOGLE_API_KEY`: Google API key for AI features
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `ANTHROPIC_API_KEY`: Anthropic API key for AI features

### CORS Settings
Configured to allow requests from:
- `http://localhost:3000` (local development)
- `https://danisaghy.github.io` (GitHub Pages)

## AI Features

- **Multiple Providers**: OpenAI, Anthropic, Google, Cohere, Ollama
- **Natural Language**: Convert text to structured todos
- **Fallback Handling**: Graceful degradation when AI services fail
- **Rate Limiting**: Built-in retry logic with exponential backoff

## Related

- **[Frontend Guide](../frontend/README.md)** - Frontend documentation
- **[AI Integration](../AI_INTEGRATION.md)** - AI features setup
- **[Main README](../README.md)** - Project overview
