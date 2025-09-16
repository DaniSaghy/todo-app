"""
Tests for priority functionality
"""

def test_todos_by_priority(client):
    """Test filtering todos by priority level"""
    # Create todos with different priorities
    client.post("/todos", json={"title": "Low Priority Todo", "priority": 0})
    client.post("/todos", json={"title": "Medium Priority Todo", "priority": 1})
    client.post("/todos", json={"title": "High Priority Todo", "priority": 2})
    
    # Test filtering by priority 0
    response = client.get("/todos/priority/0")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert all(todo["priority"] == 0 for todo in data)
    
    # Test filtering by priority 2
    response = client.get("/todos/priority/2")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert all(todo["priority"] == 2 for todo in data)

def test_invalid_priority_creation(client):
    """Test validation of invalid priority values"""
    response = client.post("/todos", json={"title": "Invalid Priority", "priority": 5})
    assert response.status_code == 422  # Validation error
    assert "detail" in response.json()

def test_invalid_priority_url(client):
    """Test validation of invalid priority in URL"""
    response = client.get("/todos/priority/5")
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid priority"

def test_priority_update(client):
    """Test updating todo priority"""
    # Create a todo
    create_response = client.post("/todos", json={"title": "Test Todo", "priority": 0})
    todo_id = create_response.json()["id"]
    
    # Update priority
    response = client.put(f"/todos/{todo_id}", json={"priority": 2})
    assert response.status_code == 200
    data = response.json()
    assert data["priority"] == 2

def test_completed_todos_filter(client):
    """Test filtering completed todos"""
    # Create completed and incomplete todos
    client.post("/todos", json={"title": "Completed Todo", "completed": True})
    client.post("/todos", json={"title": "Incomplete Todo", "completed": False})
    
    # Test completed filter
    response = client.get("/todos/completed")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert all(todo["completed"] == True for todo in data)