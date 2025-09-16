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
python -m pytest tests/test_ai_real.py -v

# Run specific test
python -m pytest tests/test_main.py::test_create_todo -v

# Run with coverage
python -m pytest tests/ --cov=main --cov=ai_service -v

# Run only mock AI tests
python -m pytest tests/ -m "ai_mock" -v

# Run only real AI tests (requires API keys)
python -m pytest tests/ -m "ai_real" -v

# Run tests excluding real AI tests
python -m pytest tests/ -m "not ai_real" -v

```

## Test Environment

For AI integration tests to work properly, you need to set environment variables:

```bash
# Set dummy API keys for testing (tests use mocks anyway)
export OPENAI_API_KEY="test-key"
export ANTHROPIC_API_KEY="test-key"

# Or run tests with environment variables
OPENAI_API_KEY="test-key" ANTHROPIC_API_KEY="test-key" pytest tests/ -v
```

The AI integration tests use mocked responses, so real API keys are not required for testing.

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

## GitHub Actions

The project uses a single CI pipeline (`ci.yml`) that runs on every push to `main`:

- **Backend Tests**: Unit and integration tests with mocked AI responses
- **Frontend Tests**: Jest tests and linting
- **Integration Tests**: Full-stack service testing
- **AI Mock Tests**: Fast AI logic testing with mocked responses
- **AI Real Tests**: Optional Google API testing (requires API key)

The pipeline ensures all tests pass before code is merged to main.
