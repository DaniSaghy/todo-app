"""
Tests for main API endpoints
"""

def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Todo API is running"}

def test_create_todo(client):
    response = client.post(
        "/todos",
        json={"title": "Test Todo", "description": "Test Description"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["description"] == "Test Description"
    assert data["completed"] == False
    assert data["priority"] == 0  # Default priority
    assert "id" in data

def test_create_todo_with_priority(client):
    response = client.post(
        "/todos",
        json={"title": "High Priority Todo", "description": "Important task", "priority": 2}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "High Priority Todo"
    assert data["description"] == "Important task"
    assert data["priority"] == 2
    assert data["completed"] == False
    assert "id" in data

def test_get_todos(client):
    # Create a todo first
    client.post("/todos", json={"title": "Test Todo"})
    
    response = client.get("/todos")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(todo["title"] == "Test Todo" for todo in data)

def test_get_todo(client):
    # Create a todo first
    create_response = client.post("/todos", json={"title": "Test Todo"})
    todo_id = create_response.json()["id"]
    
    response = client.get(f"/todos/{todo_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Todo"

def test_update_todo(client):
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

def test_delete_todo(client):
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
