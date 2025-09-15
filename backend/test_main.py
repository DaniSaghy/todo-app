from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
from main import app, get_db, Base
import os

# Create a separate test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_todos.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create test database tables
Base.metadata.create_all(bind=engine)

# Override the dependency to use test database
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Todo API is running"}

def test_create_todo():
    response = client.post(
        "/todos",
        json={"title": "Test Todo", "description": "Test Description"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["description"] == "Test Description"
    assert data["completed"] == False
    assert "id" in data

def test_get_todos():
    # Create a todo first
    client.post("/todos", json={"title": "Test Todo"})
    
    response = client.get("/todos")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(todo["title"] == "Test Todo" for todo in data)

def test_get_todo():
    # Create a todo first
    create_response = client.post("/todos", json={"title": "Test Todo"})
    todo_id = create_response.json()["id"]
    
    response = client.get(f"/todos/{todo_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Todo"

def test_update_todo():
    # Create a todo first
    create_response = client.post("/todos", json={"title": "Test Todo"})
    todo_id = create_response.json()["id"]
    
    # Update the todo
    response = client.put(
        f"/todos/{todo_id}",
        json={"title": "Updated Todo", "completed": True}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Todo"
    assert data["completed"] == True

def test_delete_todo():
    # Create a todo first
    create_response = client.post("/todos", json={"title": "Test Todo"})
    todo_id = create_response.json()["id"]
    
    # Delete the todo
    response = client.delete(f"/todos/{todo_id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Todo deleted successfully"}
    
    # Verify it's deleted
    get_response = client.get(f"/todos/{todo_id}")
    assert get_response.status_code == 404

# Cleanup: Remove test database after tests
def cleanup_test_db():
    if os.path.exists("test_todos.db"):
        os.remove("test_todos.db")

# Run cleanup after all tests
import atexit
atexit.register(cleanup_test_db)
