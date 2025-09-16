# Tests

This directory contains all test files for the Todo App Backend.

## Test Structure

```
tests/
├── __init__.py              # Makes this a Python package
├── conftest.py              # Shared test fixtures and configuration
├── test_main.py             # Tests for main API endpoints
├── test_priority.py         # Tests for priority functionality
└── test_ai_integration.py   # Tests for AI integration
```

## Running Tests

### Using pytest directly:
```bash
# Run all tests
python -m pytest tests/ -v

# Run specific test file
python -m pytest tests/test_main.py -v

# Run specific test
python -m pytest tests/test_main.py::test_create_todo -v
```

### Using the test runner:
```bash
# Run all tests
python test_runner.py all

# Run main API tests
python test_runner.py main

# Run priority tests
python test_runner.py priority

# Run AI integration tests
python test_runner.py ai

# Run with coverage
python test_runner.py coverage
```

## Test Database

Tests use a separate SQLite database (`test_todos.db`) that is automatically created and cleaned up for each test run. This ensures tests don't interfere with your development database.

## Test Fixtures

The `conftest.py` file provides shared fixtures:

- `test_db`: Fresh database session for each test
- `client`: FastAPI test client with database override
- `cleanup_test_db`: Automatic cleanup after tests

## Writing New Tests

1. Create test files with `test_` prefix
2. Use the `client` fixture for API endpoint tests
3. Use the `test_db` fixture for direct database tests
4. Follow the naming convention: `test_function_name`

Example:
```python
def test_create_todo_with_priority(client):
    response = client.post(
        "/todos",
        json={"title": "Test Todo", "priority": 2}
    )
    assert response.status_code == 200
    assert response.json()["priority"] == 2
```
