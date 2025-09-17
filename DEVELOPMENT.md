# Development Guide

Detailed development instructions for the Todo App.

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker
```bash
docker-compose up --build
```

## AI Features Setup

1. Copy environment template:
```bash
cd backend
cp env.example .env
```

2. Add your API keys to `.env`:
```env
# At least one of these is required
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
COHERE_API_KEY=your_cohere_api_key_here
OLLAMA_BASE_URL=http://localhost:11434
```

3. Restart the backend server

See [AI Integration Guide](AI_INTEGRATION.md) for detailed AI setup.

## Testing Commands

### Backend Tests
```bash
cd backend

# Run all tests
pytest -v

# Run specific test files
pytest tests/test_main.py -v
pytest tests/test_priority.py -v
pytest tests/test_ai_integration.py -v

# Run with coverage
pytest --cov=main --cov=ai_service -v

# Run only fast tests (exclude slow AI tests)
pytest -m "not slow" -v
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:watch  # Watch mode
```

## Development Notes

- **Backend**: Runs on port 8000
- **Frontend**: Runs on port 3000
- **Database**: `backend/todos.db` (SQLite)
- **API Docs**: http://localhost:8000/docs
- **Environment**: Copy `backend/env.example` to `backend/.env`

## Key Features

- **Priority System**: Todos can have Low (0), Medium (1), or High (2) priority
- **AI Integration**: Generate todos from natural language using multiple AI providers
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Instant UI updates without page refresh
- **Comprehensive Testing**: Unit, integration, and AI service tests

## Related

- **[Frontend Guide](frontend/README.md)** - Frontend development
- **[Backend Guide](backend/README.md)** - Backend development
- **[AI Integration](AI_INTEGRATION.md)** - AI features setup
