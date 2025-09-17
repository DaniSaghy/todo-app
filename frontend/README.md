# Frontend - Next.js Todo App

Modern React frontend for the Todo application with AI-powered task generation.

## Live Demo

- **Production**: [https://danisaghy.github.io/todo-app/](https://danisaghy.github.io/todo-app/)
- **Backend API**: [https://todo-app-production-173e.up.railway.app/](https://todo-app-production-173e.up.railway.app/)

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API calls

## Quick Start

### Prerequisites
- Node.js 20+

### Development
```bash
cd frontend
npm install
npm run dev
```

- **Local**: http://localhost:3000
- **Backend**: http://localhost:8000 (make sure backend is running)

### Build & Test
```bash
# Build for production
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main todo page
│   └── favicon.svg        # App favicon
├── components/            # React components
│   ├── AITodoChat.tsx     # AI-powered todo generation
│   ├── PriorityIcon.tsx   # Priority visual indicators
│   ├── TodoForm.tsx       # Todo creation/editing form
│   └── TodoItem.tsx       # Individual todo display
├── __tests__/             # Frontend tests
├── public/                # Static assets
└── package.json           # Dependencies
```

## UI Components

- **TodoForm**: Form for creating and editing todos with priority selection
- **TodoItem**: Individual todo item with actions and priority indicators
- **AITodoChat**: AI-powered todo generation interface
- **PriorityIcon**: Visual priority indicators (Low/Medium/High)

## Deployment

The frontend is automatically deployed to GitHub Pages via GitHub Actions:

1. **Push to main** → Triggers CI tests
2. **Tests pass** → Automatically deploys to GitHub Pages
3. **Live at**: https://danisaghy.github.io/todo-app/

See [GitHub Pages Deployment Guide](../GITHUB_PAGES_DEPLOYMENT.md) for details.

## Configuration

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL (set in GitHub Actions secrets)

### Next.js Config
- **Static Export**: Configured for GitHub Pages
- **Base Path**: `/todo-app` for GitHub Pages subdirectory
- **Image Optimization**: Disabled for static export

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Features

- **AI-Powered Todo Generation**: Natural language to structured todos
- **Priority System**: Visual indicators for Low/Medium/High priority
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Instant UI updates without page refresh
- **Modern UI**: Clean, dark theme with gradient backgrounds

## Related

- **[Backend Guide](../backend/README.md)** - Backend API documentation
- **[AI Integration](../AI_INTEGRATION.md)** - AI features setup
- **[Main README](../README.md)** - Project overview
