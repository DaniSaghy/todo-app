# GitHub Secrets Setup for AI Testing

This document explains how to set up GitHub repository secrets for real AI integration testing.

## Required Secrets

To enable real AI testing, you need to add the following secret to your GitHub repository:

### Google API Key (Recommended)
- **Secret Name**: `GOOGLE_API_KEY`
- **Description**: Google API key for Gemini models
- **How to get**: https://makersuite.google.com/app/apikey
- **Cost**: Very low (~$0.001-0.01 per test run)
- **Reliability**: High, good for testing

## How to Add Secrets

1. **Go to your GitHub repository**
2. **Click on "Settings" tab**
3. **Click on "Secrets and variables" → "Actions"**
4. **Click "New repository secret"**
5. **Enter the secret name and value**
6. **Click "Add secret"**

## Testing Strategy

### Mock Tests (Always Run)
- **When**: Every push and pull request
- **What**: Tests AI logic with mocked responses
- **Why**: Fast, reliable, no external dependencies
- **Files**: `test_ai_integration.py` with `@pytest.mark.ai_mock`

### Real Tests (With API Keys)
- **When**: Push to main branch or manual trigger
- **What**: Tests actual AI API calls
- **Why**: Verify real integration works
- **Files**: `test_ai_real.py` with `@pytest.mark.ai_real`

### Optional Tests (Flexible)
- **When**: Always run
- **What**: Tests that work with or without API keys
- **Why**: Basic functionality verification
- **Files**: `test_ai_real.py` with `@pytest.mark.ai_optional`

## Workflow Behavior

### Without API Keys
- ✅ Mock tests run and pass
- ⚠️ Real tests are skipped (continue-on-error: true)
- ✅ All other tests run and pass

### With Google API Key
- ✅ Mock tests run and pass
- ✅ Real tests run and pass
- ✅ All other tests run and pass

## Single CI Pipeline

The project uses a single, comprehensive CI pipeline (`ci.yml`) that runs on every push to `main`:

1. **Setup**: Python 3.11, Node.js 20, dependency caching
2. **Backend Tests**: Unit and integration tests with mocked AI
3. **Frontend Tests**: Jest tests and linting
4. **Build Test**: Frontend build verification
5. **Integration Tests**: Full-stack service testing
6. **AI Mock Tests**: Fast AI logic testing
7. **AI Real Tests**: Optional Google API testing
8. **Report**: Comprehensive test summary

## Local Testing

### Run Mock Tests Only
```bash
cd backend
pytest tests/test_ai_integration.py -m "ai_mock" -v
```

### Run Real Tests (with Google API key)
```bash
cd backend
export GOOGLE_API_KEY="your-google-api-key-here"
pytest tests/test_ai_real.py -m "ai_real" -v
```

### Run All Tests
```bash
cd backend
export GOOGLE_API_KEY="your-google-api-key-here"
pytest tests/ -v
```

## Cost Considerations

Real AI tests make actual API calls, which may incur costs:

- **Google Gemini**: ~$0.001-0.01 per test run (very cost-effective)

**Recommendation**: Google API is the most cost-effective option for testing.

## Security Notes

- ✅ API keys are stored securely in GitHub secrets
- ✅ Keys are only available to GitHub Actions workflows
- ✅ Keys are not exposed in logs or outputs
- ✅ Keys can be rotated/revoked at any time

## Troubleshooting

### Tests Skipped
If real tests are being skipped, check:
1. API keys are set in GitHub secrets
2. API keys are valid and have credits
3. API keys have proper permissions

### Tests Failing
If real tests fail, check:
1. API key validity
2. API rate limits
3. Network connectivity
4. API service status

### Mock Tests Failing
If mock tests fail, check:
1. Test environment setup
2. Mock configuration
3. Test data validity
