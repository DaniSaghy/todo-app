# AI Integration Guide

AI-powered todo generation using multiple LLM providers.

## Quick Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure API Keys
```bash
cp env.example .env
```

Add at least one API key to `.env`:
```env
# Recommended (cost-effective)
GOOGLE_API_KEY=your_google_api_key_here

# Alternative providers
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
COHERE_API_KEY=your_cohere_api_key_here
OLLAMA_BASE_URL=http://localhost:11434
```

### 3. Restart Backend
```bash
uvicorn main:app --reload
```

## Usage

1. Click **"Create with AI"** button
2. Type your request in natural language
3. AI generates structured todo with title and description
4. Todo is automatically added to your list

### Example Prompts
- "remind me to submit taxes next Monday at noon"
- "buy groceries for the weekend"
- "call mom this weekend"
- "schedule dentist appointment"

## Features

- **Multiple Providers**: OpenAI, Anthropic, Google, Cohere, Ollama
- **Fallback Handling**: Tries providers in sequence
- **Error Recovery**: Graceful degradation when AI fails
- **Input Validation**: Prevents malicious inputs
- **Rate Limiting**: Built-in retry logic

## Testing

```bash
# Test AI integration
cd backend
pytest tests/test_ai_integration.py -v

# Test with real API (requires API key)
pytest tests/test_ai_real.py -v
```

## Related

- **[Backend Guide](backend/README.md)** - Backend documentation
- **[Development Guide](DEVELOPMENT.md)** - Detailed setup instructions
