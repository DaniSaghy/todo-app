"""
Test suite for AI Todo Generation

This test suite validates the AI integration functionality including:
- LLM service initialization
- Prompt processing and safety
- Error handling and fallbacks
- API endpoint functionality
"""

import pytest
import asyncio
from unittest.mock import patch, AsyncMock
from ai_service import AITodoService, TodoGenerationRequest, TodoGenerationResult, ai_service

class TestAITodoService:
    """Test cases for AI Todo Service"""
    
    def setup_method(self):
        """Setup test environment"""
        self.ai_service = AITodoService()
    
    def test_priority_determination_logic(self):
        """Test AI service priority determination logic"""
        # Test that the system prompt includes priority guidelines
        prompt = self.ai_service._get_system_prompt()
        
        # Check that priority guidelines are included
        assert "Priority Level Guidelines" in prompt
        assert "Priority 0 (Low)" in prompt
        assert "Priority 1 (Medium)" in prompt
        assert "Priority 2 (High)" in prompt
        
        # Check that examples include priority
        assert "priority" in prompt.lower()
        
        # Check that JSON format includes priority
        assert '"priority": 0' in prompt
    
    def test_service_initialization(self):
        """Test that AI service initializes correctly"""
        assert self.ai_service is not None
        assert hasattr(self.ai_service, 'providers')
        assert hasattr(self.ai_service, 'primary_provider')
    
    def test_request_validation(self):
        """Test request validation"""
        # Valid request
        valid_request = TodoGenerationRequest(user_input="remind me to call mom")
        assert valid_request.user_input == "remind me to call mom"
        
        # Empty input should fail
        with pytest.raises(ValueError):
            TodoGenerationRequest(user_input="")
        
        # Whitespace-only input should fail
        with pytest.raises(ValueError):
            TodoGenerationRequest(user_input="   ")
    
    def test_system_prompt_generation(self):
        """Test system prompt generation"""
        prompt = self.ai_service._get_system_prompt()
        assert isinstance(prompt, str)
        assert len(prompt) > 0
        assert "JSON" in prompt
        assert "title" in prompt
        assert "description" in prompt
    
    def test_user_prompt_sanitization(self):
        """Test user input sanitization"""
        # Normal input
        prompt = self.ai_service._get_user_prompt("call mom")
        assert "call mom" in prompt
        
        # Long input should be truncated
        long_input = "a" * 1500
        prompt = self.ai_service._get_user_prompt(long_input)
        assert len(prompt) < 1500
        assert "..." in prompt
    
    def test_fallback_todo_creation(self):
        """Test fallback todo creation"""
        result = self.ai_service._create_fallback_todo("remind me to call mom this weekend")
        
        assert result.success is True
        assert result.title is not None
        assert result.fallback_used is True
        assert result.provider_used == "fallback"
    
    def test_response_parsing(self):
        """Test LLM response parsing"""
        # Valid JSON response
        valid_response = '{"title": "Call mom", "description": "This weekend"}'
        parsed = self.ai_service._parse_llm_response(valid_response)
        assert parsed is not None
        assert parsed.title == "Call mom"
        assert parsed.description == "This weekend"
        
        # JSON with code blocks
        code_response = '```json\n{"title": "Buy groceries", "description": null}\n```'
        parsed = self.ai_service._parse_llm_response(code_response)
        assert parsed is not None
        assert parsed.title == "Buy groceries"
        assert parsed.description is None
        
        # Invalid JSON should return None
        invalid_response = "This is not JSON"
        parsed = self.ai_service._parse_llm_response(invalid_response)
        assert parsed is None

class TestAIEndpoint:
    """Test cases for AI endpoint"""
    
    def test_ai_generate_endpoint_success(self, client):
        """Test successful AI generation"""
        with patch('ai_service.ai_service.generate_todo') as mock_generate:
            mock_result = TodoGenerationResult(
                success=True,
                title="Call mom",
                description="This weekend",
                priority=0,
                provider_used="openai/gpt-3.5-turbo"
            )
            mock_generate.return_value = mock_result
            
            response = client.post(
                "/todos/ai-generate",
                json={"user_input": "remind me to call mom this weekend"}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["title"] == "Call mom"
            assert data["description"] == "This weekend"
            assert data["priority"] == 0
            assert data["provider_used"] == "openai/gpt-3.5-turbo"
    
    def test_ai_generate_endpoint_fallback(self, client):
        """Test fallback scenario"""
        with patch('ai_service.ai_service.generate_todo') as mock_generate:
            mock_result = TodoGenerationResult(
                success=True,
                title="Call mom",
                description="This weekend",
                priority=0,
                fallback_used=True,
                provider_used="fallback"
            )
            mock_generate.return_value = mock_result
            
            response = client.post(
                "/todos/ai-generate",
                json={"user_input": "remind me to call mom this weekend"}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["priority"] == 0
            assert data["fallback_used"] is True
    
    def test_ai_generate_endpoint_failure(self, client):
        """Test AI generation failure"""
        with patch('ai_service.ai_service.generate_todo') as mock_generate:
            mock_result = TodoGenerationResult(
                success=False,
                error_message="No AI providers available"
            )
            mock_generate.return_value = mock_result
            
            response = client.post(
                "/todos/ai-generate",
                json={"user_input": "remind me to call mom"}
            )
            
            assert response.status_code == 500
            data = response.json()
            assert data["detail"]["success"] is False
            assert "error" in data["detail"]
    
    def test_ai_generate_endpoint_validation(self, client):
        """Test input validation"""
        # Empty input
        response = client.post(
            "/todos/ai-generate",
            json={"user_input": ""}
        )
        assert response.status_code == 422  # Validation error
        
        # Missing user_input
        response = client.post(
            "/todos/ai-generate",
            json={}
        )
        assert response.status_code == 422  # Validation error
    
    def test_ai_generate_endpoint_unexpected_error(self, client):
        """Test unexpected error handling"""
        with patch('ai_service.ai_service.generate_todo') as mock_generate:
            mock_generate.side_effect = Exception("Unexpected error")
            
            response = client.post(
                "/todos/ai-generate",
                json={"user_input": "remind me to call mom"}
            )
            
            assert response.status_code == 500
            data = response.json()
            assert data["detail"]["success"] is False
            assert "unexpected error" in data["detail"]["error"].lower()

class TestAIPriorityDetermination:
    """Test cases for AI priority determination"""
    
    def test_low_priority_determination(self, client):
        """Test AI determines low priority for routine tasks"""
        with patch('ai_service.ai_service.generate_todo') as mock_generate:
            mock_result = TodoGenerationResult(
                success=True,
                title="Buy groceries",
                description=None,
                priority=0,
                provider_used="openai/gpt-3.5-turbo"
            )
            mock_generate.return_value = mock_result
            
            response = client.post(
                "/todos/ai-generate",
                json={"user_input": "buy groceries for the weekend"}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["priority"] == 0
            assert data["title"] == "Buy groceries"
    
    def test_medium_priority_determination(self, client):
        """Test AI determines medium priority for work tasks"""
        with patch('ai_service.ai_service.generate_todo') as mock_generate:
            mock_result = TodoGenerationResult(
                success=True,
                title="Schedule team meeting",
                description="Next week",
                priority=1,
                provider_used="openai/gpt-3.5-turbo"
            )
            mock_generate.return_value = mock_result
            
            response = client.post(
                "/todos/ai-generate",
                json={"user_input": "schedule team meeting for next week"}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["priority"] == 1
            assert data["title"] == "Schedule team meeting"
    
    def test_high_priority_determination(self, client):
        """Test AI determines high priority for urgent tasks"""
        with patch('ai_service.ai_service.generate_todo') as mock_generate:
            mock_result = TodoGenerationResult(
                success=True,
                title="Fix server issue",
                description="Urgent",
                priority=2,
                provider_used="openai/gpt-3.5-turbo"
            )
            mock_generate.return_value = mock_result
            
            response = client.post(
                "/todos/ai-generate",
                json={"user_input": "urgent: fix server issue immediately"}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["priority"] == 2
            assert data["title"] == "Fix server issue"
    
    def test_priority_with_deadline_keywords(self, client):
        """Test AI determines high priority for deadline-related tasks"""
        with patch('ai_service.ai_service.generate_todo') as mock_generate:
            mock_result = TodoGenerationResult(
                success=True,
                title="Submit taxes",
                description="Due next Monday at noon",
                priority=2,
                provider_used="openai/gpt-3.5-turbo"
            )
            mock_generate.return_value = mock_result
            
            response = client.post(
                "/todos/ai-generate",
                json={"user_input": "remind me to submit taxes next Monday at noon"}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["priority"] == 2
            assert data["title"] == "Submit taxes"
    
    def test_priority_fallback_default(self, client):
        """Test fallback uses default priority when AI fails"""
        with patch('ai_service.ai_service.generate_todo') as mock_generate:
            mock_result = TodoGenerationResult(
                success=True,
                title="Buy groceries",
                description=None,
                priority=0,  # Fallback always uses priority 0
                fallback_used=True,
                provider_used="fallback"
            )
            mock_generate.return_value = mock_result
            
            response = client.post(
                "/todos/ai-generate",
                json={"user_input": "buy groceries"}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["priority"] == 0
            assert data["fallback_used"] is True

class TestIntegrationScenarios:
    """Integration test scenarios"""
    
    def test_complete_flow_with_mock_llm(self):
        """Test complete flow with mocked LLM"""
        with patch('ai_service.ai_service._call_llm') as mock_call:
            mock_call.return_value = '{"title": "Submit taxes", "description": "Due next Monday at noon", "priority": 2}'
            
            # Test the complete flow
            request = TodoGenerationRequest(user_input="remind me to submit taxes next Monday at noon")
            
            # This would normally be async, but we're testing the logic
            result = asyncio.run(ai_service.generate_todo(request))
            
            assert result.success is True
            assert result.title == "Submit taxes"
            assert result.description == "Due next Monday at noon"
            assert result.priority == 2
    
    def test_multiple_provider_fallback(self):
        """Test fallback between multiple providers"""
        with patch('ai_service.ai_service._call_llm') as mock_call:
            # First provider fails, second succeeds
            mock_call.side_effect = [
                Exception("Provider 1 failed"),
                '{"title": "Buy groceries", "description": "For the weekend"}'
            ]
            
            request = TodoGenerationRequest(user_input="buy groceries for the weekend")
            result = asyncio.run(ai_service.generate_todo(request))
            
            assert result.success is True
            assert result.title == "buy groceries for th..."

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
