"""
Shared test configuration and fixtures for Todo App Backend tests
"""

import os
import tempfile
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app, get_db, Base

# Create a temporary test database
@pytest.fixture(scope="session")
def test_db_path():
    """Create a temporary database file for testing"""
    with tempfile.NamedTemporaryFile(suffix='.db', delete=False) as tmp:
        return tmp.name

@pytest.fixture(scope="function")
def test_db(test_db_path):
    """Create a fresh test database for each test"""
    # Create engine with the temporary database
    engine = create_engine(f"sqlite:///{test_db_path}", connect_args={"check_same_thread": False})
    
    # Create test database tables
    Base.metadata.create_all(bind=engine)
    
    # Create session
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = TestingSessionLocal()
    
    yield db
    
    # Clean up after test
    db.close()
    Base.metadata.drop_all(bind=engine)
    engine.dispose()

@pytest.fixture(scope="function")
def client(test_db):
    """Create a test client with database override"""
    def override_get_db():
        try:
            yield test_db
        finally:
            pass  # Don't close here, let test_db fixture handle it
    
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

@pytest.fixture(autouse=True)
def cleanup_test_db(test_db_path):
    """Clean up test database after each test"""
    yield
    # Clean up the temporary database file
    if os.path.exists(test_db_path):
        try:
            os.unlink(test_db_path)
        except OSError:
            pass  # Ignore cleanup errors
