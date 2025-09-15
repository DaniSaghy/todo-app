# Todo App

A full-stack Todo application built with Next.js and FastAPI.

## Features

- **Add, Edit, Delete, and Mark Complete** todos
- **Modern UI** with Tailwind CSS
- **Real-time updates** with React state management
- **SQLite database** for data persistence
- **Comprehensive testing** setup
- **Docker support** for easy deployment
- **Responsive design** for all devices

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

## Project Structure

```
todo-app/
├── frontend/                # Next.js frontend application
│   ├── app/                 # App Router pages and layouts
│   ├── components/          # Reusable React components
│   ├── __tests__/           # Frontend tests
│   └── package.json         # Frontend dependencies
├── backend/                 # FastAPI backend application
│   ├── main.py              # FastAPI application entry point
│   ├── test_main.py         # Backend tests
│   └── requirements.txt     # Backend dependencies
├── docker-compose.yml       # Docker orchestration
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

### Example API Usage

```bash
# Create a todo
curl -X POST "http://localhost:8000/todos" \
     -H "Content-Type: application/json" \
     -d '{"title": "Learn FastAPI", "description": "Build awesome APIs"}'

# Get all todos
curl "http://localhost:8000/todos"

# Update a todo
curl -X PUT "http://localhost:8000/todos/1" \
     -H "Content-Type: application/json" \
     -d '{"completed": true}'

# Delete a todo
curl -X DELETE "http://localhost:8000/todos/1"
```

## UI Components

- **TodoForm**: Form for creating and editing todos
- **TodoItem**: Individual todo item with actions
- **Main Page**: Complete todo management interface

## Development

### Adding New Features

1. **Backend**: Add new endpoints in `main.py`
2. **Frontend**: Create components in `components/` directory
3. **Tests**: Add corresponding tests in `__tests__/` or `test_*.py`

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

