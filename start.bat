@echo off
REM Todo App Startup Script for Windows

echo 🚀 Starting Todo App...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.11+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Start backend
echo 📦 Starting FastAPI backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing backend dependencies...
pip install -r requirements.txt

REM Start backend in background
echo Starting backend server on http://localhost:8000
start /b uvicorn main:app --reload --host 0.0.0.0 --port 8000

REM Go back to root directory
cd ..

REM Start frontend
echo 🎨 Starting Next.js frontend...
cd frontend

REM Install dependencies
echo Installing frontend dependencies...
npm install

REM Start frontend
echo Starting frontend server on http://localhost:3000
start /b npm run dev

REM Go back to root directory
cd ..

echo.
echo ✅ Todo App is running!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo Press any key to stop both services
pause >nul
