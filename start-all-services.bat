@echo off
echo 🚀 Starting FebreMed AI Care Services...
echo.

echo 📁 Current directory: %CD%
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this from the project root.
    pause
    exit /b 1
)

echo 🔧 Installing/updating dependencies...
call npm install
if errorlevel 1 (
    echo ❌ npm install failed
    pause
    exit /b 1
)

echo.
echo 🐍 Starting Flask backend server...
start "Flask Backend" cmd /k "cd backend && python app.py"

echo.
echo ⏳ Waiting 3 seconds for Flask to start...
timeout /t 3 /nobreak > nul

echo.
echo 🌐 Starting React frontend...
start "React Frontend" cmd /k "npm run dev"

echo.
echo ✅ All services started!
echo.
echo 📋 Services running:
echo    - Flask Backend: http://127.0.0.1:5000
echo    - React Frontend: http://127.0.0.1:8080
echo.
echo 🧪 Testing Flask health...
node test-flask-health.js

echo.
echo 💡 Tips:
echo    - Upload a prescription image to test extraction
echo    - Check console logs if issues occur
echo    - Press Ctrl+C in service windows to stop
echo.
pause