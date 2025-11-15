@echo off
REM Start all services for complete demo
echo ========================================
echo Starting Complete Demo Environment
echo ========================================
echo.

set PROJECT_DIR=%~dp0
cd /d "%PROJECT_DIR%"

echo [1/3] Starting Flask API...
start "Flask API - Terminal 1" cmd /k "cd /d %PROJECT_DIR%backend && python app.py"

timeout /t 5 /nobreak >nul

echo [2/3] Starting ngrok tunnel...
echo IMPORTANT: Copy the HTTPS URL from ngrok terminal!
start "ngrok Tunnel - Terminal 2" cmd /k "cd /d %PROJECT_DIR% && ""C:\Program Files\ngrok.exe"" http 5000"

timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend...
start "Frontend - Terminal 3" cmd /k "cd /d %PROJECT_DIR% && npm run dev"

echo.
echo ========================================
echo All services starting!
echo ========================================
echo.
echo Next steps:
echo 1. Wait for Flask to load model (Terminal 1)
echo 2. Copy ngrok HTTPS URL (Terminal 2)
echo 3. Verify Supabase secret PYTHON_API_URL is set
echo 4. Open http://localhost:5173 in browser
echo 5. Test the assessment form!
echo.
echo Press any key to exit this window...
pause >nul

