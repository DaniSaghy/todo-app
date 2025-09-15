# Todo App Development Scripts

## Quick Start Commands

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

## Testing Commands

### Backend Tests
```bash
cd backend
pytest -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Development Notes

- Backend runs on port 8000
- Frontend runs on port 3000
- SQLite database file: `backend/todos.db`
- API docs available at: `http://localhost:8000/docs`
