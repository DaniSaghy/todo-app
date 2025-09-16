# Tests

This directory contains all test files for the Todo App Backend.

## Test Structure

```
tests/
├── __init__.py              # Makes this a Python package
├── conftest.py              # Shared test fixtures and configuration
├── test_main.py             # Tests for main API endpoints
├── test_priority.py         # Tests for priority functionality
└── test_ai_integration.py   # Tests for AI integration and service
```

## Running Tests

### Using pytest directly:
```bash
# Run all tests
python -m pytest tests/ -v

# Run specific test file
python -m pytest tests/test_main.py -v
python -m pytest tests/test_priority.py -v
python -m pytest tests/test_ai_integration.py -v

# Run specific test
python -m pytest tests/test_main.py::test_create_todo -v

# Run with coverage
python -m pytest tests/ --cov=main --cov=ai_service -v

```

## Test Database

Tests use a separate SQLite database (`test_todos.db`) that is automatically created and cleaned up for each test run. This ensures tests don't interfere with your development database.

## Test Fixtures

The `conftest.py` file provides shared fixtures:

- `test_db`: Fresh database session for each test
- `client`: FastAPI test client with database override
- `cleanup_test_db`: Automatic cleanup after tests
- `mock_ai_service`: Mock AI service for testing without API calls

## Writing New Tests

1. Create test files with `test_` prefix
2. Use the `client` fixture for API endpoint tests
3. Use the `test_db` fixture for direct database tests
4. Use the `mock_ai_service` fixture for AI-related tests
5. Follow the naming convention: `test_function_name`
6. Mark slow tests with `@pytest.mark.slow` decorator

Example:
```python
def test_create_todo_with_priority(client):
    response = client.post(
        "/todos",
        json={"title": "Test Todo", "priority": 2}
    )
    assert response.status_code == 200
    assert response.json()["priority"] == 2

@pytest.mark.slow
def test_ai_generate_todo(client, mock_ai_service):
    response = client.post(
        "/ai/generate-todo",
        json={"prompt": "test prompt"}
    )
    assert response.status_code == 200
```

## Test Categories

- **Unit Tests**: Test individual functions and methods
- **Integration Tests**: Test API endpoints and database interactions
- **AI Tests**: Test AI service functionality (marked as slow)
- **Priority Tests**: Test priority validation and functionality
