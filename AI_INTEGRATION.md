# AI-Powered Todo Generation

This todo app now includes industry-standard AI integration for converting natural language requests into structured todo items.

## Features

- **LLM-Agnostic Design**: Uses LiteLLM to support multiple providers (OpenAI, Anthropic, Google, Cohere, Ollama)
- **Robust Error Handling**: Comprehensive fallback mechanisms and graceful degradation
- **Prompt Injection Protection**: Built-in safety measures against malicious inputs
- **Rate Limiting & Retries**: Automatic retry logic with exponential backoff
- **Beautiful UI**: Modern chat interface with example prompts and real-time feedback

## Architecture

### Backend (`ai_service.py`)

The AI service follows industry best practices:

- **Service Layer Pattern**: Clean separation of concerns
- **Provider Abstraction**: Easy to add new LLM providers
- **Comprehensive Logging**: Detailed logging for debugging and monitoring
- **Input Validation**: Pydantic models for request/response validation
- **Fallback Strategy**: Graceful degradation when AI services are unavailable

### Frontend (`AITodoChat.tsx`)

The AI chat interface provides:

- **Intuitive UX**: Natural language input with helpful examples
- **Real-time Feedback**: Loading states, error messages, and success indicators
- **Responsive Design**: Works seamlessly on all device sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure API Keys

Copy the environment file and add your API keys:

```bash
cp env.example .env
```

Edit `.env` and add at least one API key:

```env
# OpenAI (recommended)
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic Claude (alternative)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Google Gemini (cost-effective)
GOOGLE_API_KEY=your_google_api_key_here

# Cohere (good for structured tasks)
COHERE_API_KEY=your_cohere_api_key_here

# Ollama (local deployment)
OLLAMA_BASE_URL=http://localhost:11434
```

### 3. Start the Application

```bash
# Start backend
cd backend
python main.py

# Start frontend (in another terminal)
cd frontend
npm run dev
```

## Usage

1. Click the **"Create with AI"** button (purple gradient)
2. Type your request in natural language
3. The AI will generate a structured todo with title and description
4. The todo is automatically created and added to your list

### Example Prompts

- "remind me to submit taxes next Monday at noon"
- "buy groceries for the weekend"
- "call mom this weekend"
- "schedule dentist appointment"
- "prepare presentation for next week's meeting"

## Error Handling

The system includes multiple layers of error handling:

1. **Input Validation**: Prevents empty or malicious inputs
2. **Provider Fallback**: Tries multiple AI providers in sequence
3. **Graceful Degradation**: Falls back to simple text parsing if all AI providers fail
4. **User Feedback**: Clear error messages and retry options
5. **Logging**: Comprehensive logging for debugging

## Testing

Run the comprehensive test suite:

```bash
cd backend
python -m pytest test_ai_integration.py -v
```

The test suite covers:
- Service initialization and configuration
- Request validation and sanitization
- LLM response parsing
- Error handling and fallbacks
- API endpoint functionality
- Integration scenarios

## Security Considerations

- **Prompt Injection Protection**: Basic filtering for malicious inputs
- **Input Length Limits**: Prevents abuse with extremely long inputs
- **API Key Security**: Environment variables for secure key management
- **Rate Limiting**: Built-in retry logic prevents API abuse

## Performance

- **Async Operations**: Non-blocking AI calls
- **Caching**: LiteLLM handles provider-specific optimizations
- **Timeout Management**: 30-second timeout prevents hanging requests
- **Efficient Parsing**: Optimized JSON parsing with fallbacks

## Monitoring

The system includes comprehensive logging:

- Request/response logging (with input truncation for privacy)
- Provider usage tracking
- Error rate monitoring
- Performance metrics

## Future Enhancements

- **Caching**: Cache common requests to reduce API calls
- **User Preferences**: Remember user's preferred AI provider
- **Batch Processing**: Handle multiple todos in one request
- **Custom Prompts**: Allow users to customize AI behavior
- **Analytics**: Track usage patterns and success rates
