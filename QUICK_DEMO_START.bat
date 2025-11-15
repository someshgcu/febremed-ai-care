@echo off
REM Quick Demo Start Script
REM This opens 3 terminals for Flask, ngrok, and frontend

echo ========================================
echo Starting Local Demo Environment
echo ========================================
echo.

REM Get the project directory
set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

echo [1/3] Starting Flask API...
start "Flask API" cmd /k "cd /d %PROJECT_DIR%backend && python app.py"

timeout /t 3 /nobreak >nul

echo [2/3] Starting ngrok tunnel...
echo IMPORTANT: Copy the HTTPS URL from ngrok and set it in Supabase!
start "ngrok Tunnel" cmd /k "ngrok http 5000"

timeout /t 2 /nobreak >nul

echo [3/3] Starting Frontend...
start "Frontend" cmd /k "cd /d %PROJECT_DIR% && npm run dev"

echo.
echo ========================================
echo All services starting!
echo ========================================
echo.
echo Next steps:
echo 1. Wait for Flask to load model
echo 2. Copy ngrok HTTPS URL (from ngrok terminal)
echo 3. Set PYTHON_API_URL in Supabase Dashboard
echo 4. Open http://localhost:5173 in browser
echo.
echo Press any key to exit this window...
pause >nul

