# GitHub Pages Deployment Guide

## Frontend Deployment Setup

Your frontend is now configured for GitHub Pages deployment with the following changes:

### 1. Next.js Configuration
- **Static Export**: Configured `output: 'export'` for static site generation
- **Base Path**: Set to `/todo-app` for GitHub Pages subdirectory
- **Image Optimization**: Disabled for static export compatibility

### 2. GitHub Actions Workflow
- **Test-Driven Deployment**: Only deploys after CI tests pass
- **Workflow Dependency**: Triggers after "CI/CD Pipeline" completes successfully
- **Node.js 20**: Uses latest LTS version
- **Caching**: npm dependencies are cached for faster builds
- **Pages Integration**: Uses GitHub's official Pages deployment action

### 3. Environment Variables
- **API URL**: Uses `NEXT_PUBLIC_API_URL` environment variable
- **Fallback**: Defaults to `http://localhost:8000` for local development

## Deployment Flow

Your deployment now follows a **test-driven approach**:

1. **Push to `main`** → Triggers CI/CD Pipeline
2. **CI Tests Run** → Backend tests, frontend tests, linting, build, integration tests
3. **Tests Pass** → Automatically triggers GitHub Pages deployment
4. **Tests Fail** → No deployment (prevents broken code from going live)

This ensures only tested, working code gets deployed to production.

## Deployment Steps

### 1. Enable GitHub Pages
1. Go to your repository: https://github.com/DaniSaghy/todo-app
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Save the settings

### 2. Deploy Backend First
Before the frontend can work, you need to deploy your backend to Railway:

1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy the backend
4. Get your backend URL (e.g., `https://your-app.railway.app`)

### 3. Update Frontend API URL
Once you have your backend URL, update the GitHub Actions workflow:

1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Add a new repository secret:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend-url.railway.app`

### 4. Trigger Deployment
1. Push any change to the `main` branch
2. Go to **Actions** tab to watch the CI tests run
3. If tests pass, deployment will automatically start
4. Once complete, your app will be available at:
   `https://danisaghy.github.io/todo-app/`

## Testing Locally

To test the static export locally:

```bash
cd frontend
npm run build
npx serve out
```

## Troubleshooting

### Common Issues

1. **404 Errors**: Make sure GitHub Pages is enabled and using GitHub Actions
2. **API Errors**: Verify `NEXT_PUBLIC_API_URL` secret is set correctly
3. **Build Failures**: Check the Actions tab for detailed error logs
4. **CORS Errors**: Update backend CORS settings to include your GitHub Pages URL

### Backend CORS Update Needed

Update your backend `main.py` CORS settings:

```python
allow_origins=[
    "http://localhost:3000",
    "https://danisaghy.github.io"  # Add this line
]
```

## Next Steps

1. Deploy backend to Railway
2. Update CORS settings in backend
3. Set `NEXT_PUBLIC_API_URL` secret in GitHub
4. Push to trigger deployment
5. Test the deployed application
