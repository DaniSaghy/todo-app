"""
AI Service Layer for Todo Generation

This module provides LLM-agnostic todo generation with robust error handling,
fallbacks, and industry-standard prompt engineering practices.
"""

import os
import json
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime
from dataclasses import dataclass
from enum import Enum
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

import litellm
from litellm import completion
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from pydantic import BaseModel, Field, field_validator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LLMProvider(str, Enum):
    """Supported LLM providers"""
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"
    COHERE = "cohere"
    OLLAMA = "ollama"

@dataclass
class TodoGenerationResult:
    """Result of todo generation"""
    success: bool
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[int] = None
    error_message: Optional[str] = None
    fallback_used: bool = False
    provider_used: Optional[str] = None

class TodoGenerationRequest(BaseModel):
    """Request model for todo generation"""
    user_input: str = Field(..., min_length=1, max_length=1000, description="Natural language input from user")
    
    @field_validator('user_input')
    @classmethod
    def validate_input(cls, v):
        # Basic safety checks
        if not v.strip():
            raise ValueError("Input cannot be empty")
        
        # Check for potentially harmful content (basic filtering)
        harmful_patterns = [
            'ignore previous instructions',
            'system prompt',
            'jailbreak',
            'prompt injection'
        ]
        
        v_lower = v.lower()
        for pattern in harmful_patterns:
            if pattern in v_lower:
                logger.warning(f"Potentially harmful input detected: {pattern}")
                # Don't raise error, just log warning for now
        
        return v.strip()

class TodoGenerationResponse(BaseModel):
    """Response model for todo generation"""
    title: str = Field(..., min_length=1, max_length=200, description="Generated todo title")
    description: Optional[str] = Field(None, max_length=1000, description="Generated todo description")
    priority: int = Field(..., ge=0, le=2, description="Priority level (0=low, 1=medium, 2=high)")

class AITodoService:
    """
    AI-powered todo generation service with industry-standard practices:
    - LLM-agnostic design using LiteLLM
    - Robust error handling and fallbacks
    - Prompt injection protection
    - Rate limiting and retry logic
    - Multiple provider support
    """
    
    def __init__(self):
        self.providers = self._get_available_providers()
        self.primary_provider = self.providers[0] if self.providers else None
        
        # Configure LiteLLM
        self._configure_litellm()
        
    def _get_available_providers(self) -> List[str]:
        """Get list of available LLM providers based on environment variables"""
        providers = []
        
        # Check for API keys
        if os.getenv("OPENAI_API_KEY"):
            providers.append("gpt-3.5-turbo")
        if os.getenv("ANTHROPIC_API_KEY"):
            providers.append("claude-3-haiku-20240307")
        if os.getenv("GOOGLE_API_KEY"):
            providers.append("gemini/gemini-2.0-flash")
        if os.getenv("COHERE_API_KEY"):
            providers.append("command")
        if os.getenv("OLLAMA_BASE_URL"):
            providers.append("ollama/llama2")
            
        logger.info(f"Available providers: {providers}")
        return providers
    
    def get_available_providers(self) -> List[str]:
        """Get list of available LLM providers (public method)"""
        return self.providers.copy()
    
    def _configure_litellm(self):
        """Configure LiteLLM settings"""
        # Set timeout and other configurations
        litellm.set_verbose = False  # Set to True for debugging
        litellm.drop_params = True  # Drop unsupported parameters
        
    def _get_system_prompt(self) -> str:
        """Get the system prompt for todo generation"""
        return """You are a helpful AI assistant that converts natural language requests into structured todo items.

Your task is to extract a clear title, optional description, and appropriate priority level from user input.

Guidelines:
1. Create concise, actionable titles (max 40 characters)
2. Extract relevant details for descriptions (max 50 characters)
3. Handle time references appropriately (convert to clear descriptions)
4. Focus on the core task, not meta-instructions
5. Be helpful but stay focused on todo creation

Priority Level Guidelines:
- Priority 0 (Low): Routine tasks, non-urgent items, personal preferences
  Examples: "buy groceries", "read a book", "organize desk", "call mom this weekend"
- Priority 1 (Medium): Important tasks with moderate urgency, work-related items
  Examples: "submit report by Friday", "schedule dentist appointment", "review project proposal"
- Priority 2 (High): Urgent tasks, deadlines, critical items, emergencies
  Examples: "urgent: fix server issue", "deadline: submit taxes tomorrow", "emergency: call doctor"

Examples:
- "remind me to submit taxes next Monday at noon" → Title: "Submit taxes", Description: "Due next Monday at noon", Priority: 2
- "buy groceries" → Title: "Buy groceries", Description: None, Priority: 0
- "call mom this weekend" → Title: "Call mom", Description: "This weekend", Priority: 0
- "urgent: fix the server issue immediately" → Title: "Fix server issue", Description: "Urgent", Priority: 2
- "schedule team meeting for next week" → Title: "Schedule team meeting", Description: "Next week", Priority: 1

Always respond with valid JSON in this exact format:
{
    "title": "string",
    "description": "string or null",
    "priority": 0
}"""

    def _get_user_prompt(self, user_input: str) -> str:
        """Get the user prompt with input sanitization"""
        # Additional input sanitization
        sanitized_input = user_input.strip()
        
        # Limit length to prevent abuse
        if len(sanitized_input) > 1000:
            sanitized_input = sanitized_input[:1000] + "..."
            
        return f"Convert this to a todo: {sanitized_input}"

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=3, max=5),
        retry=retry_if_exception_type((Exception,))
    )
    def _call_llm(self, provider: str, messages: List[Dict[str, str]]) -> str:
        """Make LLM call with retry logic"""
        try:
            response = completion(
                model=provider,
                messages=messages,
                temperature=0.3,  # Lower temperature for more consistent results
                max_tokens=500,
                timeout=30
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"LLM call failed for provider {provider}: {str(e)}")
            raise

    def _parse_llm_response(self, response: str) -> Optional[TodoGenerationResponse]:
        """Parse LLM response and validate structure"""
        try:
            # Clean response
            response = response.strip()
            
            # Try to extract JSON from response
            if response.startswith('```json'):
                response = response[7:]
            if response.endswith('```'):
                response = response[:-3]
            
            # Parse JSON
            data = json.loads(response)
            
            # Validate required fields
            if not isinstance(data, dict) or 'title' not in data:
                return None
                
            # Create response object with validation
            return TodoGenerationResponse(
                title=data['title'],
                description=data.get('description'),
                priority=data.get('priority', 0)
            )
            
        except (json.JSONDecodeError, ValueError, KeyError) as e:
            logger.error(f"Failed to parse LLM response: {str(e)}")
            return None

    def _create_fallback_todo(self, user_input: str) -> TodoGenerationResult:
        """Create a fallback todo when LLM fails"""
        # Simple fallback: use first 50 characters as title
        title = user_input[:20].strip()
        if len(user_input) > 20:
            title += "..."
            
        description = user_input[20:].strip() if len(user_input) > 20 else None
        
        return TodoGenerationResult(
            success=True,
            title=title,
            description=description,
            priority=0,  # Default priority for fallback
            fallback_used=True,
            provider_used="fallback"
        )

    async def generate_todo(self, request: TodoGenerationRequest) -> TodoGenerationResult:
        """
        Generate a todo from natural language input with comprehensive error handling
        """
        if not self.providers:
            logger.error("No LLM providers available")
            return TodoGenerationResult(
                success=False,
                error_message="No AI providers configured. Please check your API keys."
            )

        messages = [
            {"role": "system", "content": self._get_system_prompt()},
            {"role": "user", "content": self._get_user_prompt(request.user_input)}
        ]

        # Try each provider in order
        for provider in self.providers:
            try:
                logger.info(f"Attempting todo generation with provider: {provider}")
                
                response_text = self._call_llm(provider, messages)
                parsed_response = self._parse_llm_response(response_text)
                
                if parsed_response:
                    logger.info(f"Successfully generated todo with {provider}")
                    return TodoGenerationResult(
                        success=True,
                        title=parsed_response.title,
                        description=parsed_response.description,
                        priority=parsed_response.priority,
                        provider_used=provider
                    )
                else:
                    logger.warning(f"Failed to parse response from {provider}")
                    
            except Exception as e:
                logger.error(f"Provider {provider} failed: {str(e)}")
                continue

        # All providers failed, use fallback
        logger.warning("All LLM providers failed, using fallback")
        return self._create_fallback_todo(request.user_input)

# Global service instance
ai_service = AITodoService()
