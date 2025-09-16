# Todo App

A full-stack Todo application built with Next.js and FastAPI.

## Features

- **Add, Edit, Delete, and Mark Complete** todos
- **Priority System** with visual indicators (Low/Medium/High)
- **AI-Powered Todo Generation** using natural language
- **Modern UI** with Tailwind CSS and responsive design
- **Real-time updates** with React state management
- **SQLite database** for data persistence
- **Comprehensive testing** setup with pytest and Jest
- **Docker support** for easy deployment
- **Multiple AI Providers** support (OpenAI, Anthropic, Google, Cohere, Ollama)

## Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **FastAPI** for the REST API
- **SQLAlchemy** for database ORM
- **SQLite** for data persistence
- **Pydantic** for data validation
- **Uvicorn** as ASGI server
- **LiteLLM** for AI provider abstraction
- **python-dotenv** for environment management

## Project Structure

```
todo-app/
├── frontend/                # Next.js frontend application
│   ├── app/                 # App Router pages and layouts
│   ├── components/          # Reusable React components
│   │   ├── AITodoChat.tsx   # AI-powered todo generation
│   │   ├── PriorityIcon.tsx # Priority visual indicators
│   │   ├── TodoForm.tsx     # Todo creation/editing form
│   │   └── TodoItem.tsx     # Individual todo display
│   ├── __tests__/           # Frontend tests
│   └── package.json         # Frontend dependencies
├── backend/                 # FastAPI backend application
│   ├── main.py              # FastAPI application entry point
│   ├── ai_service.py        # AI integration service
│   ├── tests/               # Backend test suite
│   │   ├── test_main.py     # API endpoint tests
│   │   ├── test_ai_integration.py # AI service tests
│   │   └── test_priority.py # Priority functionality tests
│   ├── requirements.txt     # Backend dependencies
│   └── env.example          # Environment variables template
├── docker-compose.yml       # Docker orchestration
├── AI_INTEGRATION.md        # AI features documentation
├── DEVELOPMENT.md           # Development setup guide
└── README.md               # This file
```

## Quick Start

For detailed setup instructions, see [DEVELOPMENT.md](DEVELOPMENT.md).

**Prerequisites:** Node.js 20+, Python 3.11+, Docker (optional)

**Quick commands:**
```bash
# Backend
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload

# Frontend  
cd frontend && npm install && npm run dev

# Or use Docker
docker-compose up --build
```

**For AI features:** Copy `backend/env.example` to `backend/.env` and add your API keys. See [AI_INTEGRATION.md](AI_INTEGRATION.md) for details.

- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:8000`
- **API Docs**: `http://localhost:8000/docs`

## Testing

For detailed testing instructions, see [DEVELOPMENT.md](DEVELOPMENT.md).

**Quick test commands:**
```bash
# Backend tests
cd backend && pytest -v

# Frontend tests  
cd frontend && npm test
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
| POST | `/ai/generate-todo` | Generate todo from natural language |

### Example API Usage

```bash
# Create a todo with priority
curl -X POST "http://localhost:8000/todos" \
     -H "Content-Type: application/json" \
     -d '{"title": "Learn FastAPI", "description": "Build awesome APIs", "priority": 2}'

# Get all todos
curl "http://localhost:8000/todos"

# Update a todo
curl -X PUT "http://localhost:8000/todos/1" \
     -H "Content-Type: application/json" \
     -d '{"completed": true, "priority": 1}'

# Delete a todo
curl -X DELETE "http://localhost:8000/todos/1"

# Generate todo with AI
curl -X POST "http://localhost:8000/ai/generate-todo" \
     -H "Content-Type: application/json" \
     -d '{"prompt": "remind me to submit taxes next Monday"}'
```

## UI Components

- **TodoForm**: Form for creating and editing todos with priority selection
- **TodoItem**: Individual todo item with actions and priority indicators
- **AITodoChat**: AI-powered todo generation interface
- **PriorityIcon**: Visual priority indicators (Low/Medium/High)
- **Main Page**: Complete todo management interface with sorting and filtering

## Development

### Adding New Features

1. **Backend**: Add new endpoints in `main.py` or create new service files
2. **Frontend**: Create components in `components/` directory
3. **Tests**: Add corresponding tests in `__tests__/` or `test_*.py`
4. **AI Features**: Extend `ai_service.py` for new AI capabilities

### Code Style

- **Frontend**: ESLint + Prettier (configured)
- **Backend**: Follow PEP 8 guidelines
- **TypeScript**: Strict mode enabled

## Deployment

### Production Build

#### Frontend
```bash
cd frontend
npm run build
npm start
```

#### Backend
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Docker Production

```bash
docker-compose -f docker-compose.yml up --build
```

## Troubleshooting

### Common Issues

1. **Port already in use**: Change ports in `package.json` or `main.py`
2. **Database issues**: Delete `todos.db` to reset the database
3. **CORS errors**: Ensure backend is running on port 8000

### Getting Help

- Check the API documentation at `http://localhost:8000/docs`
- Review the test files for usage examples
- Open an issue for bugs or feature requests

## License

This project is open source and available under the [MIT License](LICENSE).

