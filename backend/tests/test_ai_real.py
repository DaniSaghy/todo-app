"""
Real AI Integration Tests

These tests use actual AI API calls and require valid API keys.
They are marked with @pytest.mark.ai_real and will only run when
real API keys are available.
"""

import pytest
import asyncio
import os
from ai_service import AITodoService, TodoGenerationRequest, ai_service


@pytest.mark.ai_real
@pytest.mark.slow
class TestRealAIIntegration:
    """Test AI integration with real API calls"""
    
    def setup_method(self):
        """Setup test environment"""
        self.ai_service = AITodoService()
        
    def test_real_ai_service_initialization(self):
        """Test that AI service initializes with real providers"""
        providers = self.ai_service.get_available_providers()
        assert len(providers) > 0, "No AI providers available. Check your API keys."
        print(f"Available providers: {providers}")
        
    @pytest.mark.asyncio
    async def test_real_todo_generation_google(self):
        """Test real todo generation with Google Gemini"""
        if 'gemini/gemini-2.0-flash' not in self.ai_service.get_available_providers():
            pytest.skip("Google provider not available")
            
        request = TodoGenerationRequest(
            user_input="remind me to submit taxes next Monday at noon"
        )
        
        result = await self.ai_service.generate_todo(request)
        
        assert result.success is True, f"AI generation failed: {result.error_message}"
        assert result.title is not None
        assert result.description is not None
        assert result.priority is not None
        assert result.provider_used is not None
        
        print(f"Generated todo: {result.title} - {result.description} (Priority: {result.priority})")
        
    @pytest.mark.asyncio
    async def test_real_todo_generation_google_simple(self):
        """Test real todo generation with Google Gemini - simple task"""
        if 'gemini/gemini-2.0-flash' not in self.ai_service.get_available_providers():
            pytest.skip("Google provider not available")
            
        request = TodoGenerationRequest(
            user_input="buy groceries for the weekend"
        )
        
        result = await self.ai_service.generate_todo(request)
        
        assert result.success is True, f"AI generation failed: {result.error_message}"
        assert result.title is not None
        assert result.description is not None
        assert result.priority is not None
        
        print(f"Generated todo: {result.title} - {result.description} (Priority: {result.priority})")
        
    @pytest.mark.asyncio
    async def test_real_priority_determination(self):
        """Test that AI correctly determines priority levels"""
        test_cases = [
            ("urgent deadline tomorrow", 2),  # High priority
            ("schedule dentist appointment", 1),  # Medium priority
            ("buy milk when convenient", 0),  # Low priority
        ]
        
        for user_input, expected_priority in test_cases:
            request = TodoGenerationRequest(user_input=user_input)
            result = await self.ai_service.generate_todo(request)
            
            assert result.success is True, f"AI generation failed for '{user_input}': {result.error_message}"
            assert result.priority == expected_priority, f"Expected priority {expected_priority} for '{user_input}', got {result.priority}"
            
            print(f"✓ '{user_input}' -> Priority {result.priority} (expected {expected_priority})")
            
    @pytest.mark.asyncio
    async def test_real_multiple_providers(self):
        """Test that Google provider works correctly"""
        providers = self.ai_service.get_available_providers()
        
        if 'gemini/gemini-2.0-flash' not in providers:
            pytest.skip("Google provider not available")
            
        request = TodoGenerationRequest(
            user_input="call mom this weekend"
        )
        
        result = await self.ai_service.generate_todo(request)
        
        assert result.success is True, f"AI generation failed: {result.error_message}"
        assert result.provider_used in providers, f"Provider {result.provider_used} not in available providers {providers}"
        
        print(f"Used provider: {result.provider_used}")
        
    @pytest.mark.asyncio
    async def test_real_error_handling(self):
        """Test error handling with real API calls"""
        # Test with empty input
        request = TodoGenerationRequest(user_input="")
        result = await self.ai_service.generate_todo(request)
        
        # Should either succeed with fallback or fail gracefully
        if not result.success:
            assert result.error_message is not None
            print(f"Expected error for empty input: {result.error_message}")
        else:
            print(f"Fallback used for empty input: {result.title}")


@pytest.mark.ai_real
@pytest.mark.slow
class TestRealAIEndpoint:
    """Test AI endpoint with real API calls"""
    
    def test_real_ai_generate_endpoint(self, client):
        """Test AI generation endpoint with real API calls"""
        response = client.post(
            "/ai/generate-todo",
            json={"prompt": "remind me to submit taxes next Monday at noon"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True, f"AI generation failed: {data.get('error', 'Unknown error')}"
        assert data["title"] is not None
        assert data["description"] is not None
        assert data["priority"] is not None
        
        print(f"API Response: {data}")
        
    def test_real_ai_endpoint_error_handling(self, client):
        """Test AI endpoint error handling with real API calls"""
        # Test with empty prompt
        response = client.post(
            "/ai/generate-todo",
            json={"prompt": ""}
        )
        
        # Should either succeed with fallback or return error
        assert response.status_code in [200, 400]
        
        if response.status_code == 200:
            data = response.json()
            assert data["success"] is True or data["fallback_used"] is True
        else:
            data = response.json()
            assert "error" in data["detail"]


@pytest.mark.ai_optional
class TestAIOptional:
    """Tests that can run with or without real API keys"""
    
    def test_ai_service_initialization_optional(self):
        """Test AI service initialization (works with or without API keys)"""
        providers = ai_service.get_available_providers()
        
        if len(providers) > 0:
            print(f"AI providers available: {providers}")
            assert len(providers) > 0
        else:
            print("No AI providers available (no API keys set)")
            # This is OK for development/testing
            
    def test_ai_service_configuration(self):
        """Test AI service configuration"""
        # Test that service can be instantiated
        service = AITodoService()
        assert service is not None
        
        # Test configuration methods
        providers = service.get_available_providers()
        assert isinstance(providers, list)
        
        # Test prompt generation
        system_prompt = service._get_system_prompt()
        assert isinstance(system_prompt, str)
        assert len(system_prompt) > 0
        
        user_prompt = service._get_user_prompt("test input")
        assert isinstance(user_prompt, str)
        assert "test input" in user_prompt


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
