# Todo App

[![Tests](https://github.com/DaniSaghy/todo-app/actions/workflows/ci.yml/badge.svg)](https://github.com/DaniSaghy/todo-app/actions)

A full-stack Todo application with AI-powered task generation.

## Live Demo

- **Frontend**: [https://danisaghy.github.io/todo-app/](https://danisaghy.github.io/todo-app/)
- **Backend API**: [https://todo-app-production-173e.up.railway.app/](https://todo-app-production-173e.up.railway.app/)

## Features

- **AI-Powered Todo Generation** using natural language
- **Priority System** with visual indicators (Low/Medium/High)
- **Modern UI** with Tailwind CSS and responsive design
- **Real-time updates** with React state management
- **SQLite database** for data persistence
- **Comprehensive testing** with pytest and Jest

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: FastAPI, SQLAlchemy, SQLite
- **AI**: LiteLLM (supports OpenAI, Anthropic, Google, Cohere, Ollama)
- **Deployment**: GitHub Pages + Railway

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+

### Local Development
```bash
# Backend
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload

# Frontend  
cd frontend && npm install && npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Docker
```bash
docker-compose up --build
```

## Documentation

- **[Frontend Guide](frontend/README.md)** - Frontend development and deployment
- **[Backend Guide](backend/README.md)** - Backend development and API
- **[AI Integration](AI_INTEGRATION.md)** - AI features setup
- **[Development Guide](DEVELOPMENT.md)** - Detailed development instructions
- **[GitHub Pages Deployment](GITHUB_PAGES_DEPLOYMENT.md)** - Deployment guide

## Testing

```bash
# Backend tests
cd backend && pytest -v

# Frontend tests  
cd frontend && npm test
```

## Project Structure

```
todo-app/
├── frontend/          # Next.js frontend (see frontend/README.md)
├── backend/           # FastAPI backend (see backend/README.md)
├── .github/workflows/ # CI/CD pipelines
└── docs/             # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `cd backend && pytest` and `cd frontend && npm test`
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.