@echo off
echo ========================================
echo Flask Server Setup and Start
echo ========================================
echo.

cd backend

REM Check if venv exists and is valid
if not exist "venv\Scripts\python.exe" (
    echo [0/4] Virtual environment not found or invalid. Creating new one...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        echo Please make sure Python is installed and in PATH
        pause
        exit /b 1
    )
    echo Virtual environment created successfully!
    echo.
)

echo [1/4] Upgrading pip...
venv\Scripts\python.exe -m pip install --upgrade pip --quiet

echo [2/4] Installing dependencies...
venv\Scripts\python.exe -m pip install Flask Flask-Cors Pillow pytesseract google-generativeai python-dotenv

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Trying to recreate virtual environment...
    rmdir /s /q venv
    python -m venv venv
    venv\Scripts\python.exe -m pip install --upgrade pip
    venv\Scripts\python.exe -m pip install Flask Flask-Cors Pillow pytesseract google-generativeai python-dotenv
    if errorlevel 1 (
        echo.
        echo ERROR: Still failed to install dependencies
        echo Please check the error messages above
        pause
        exit /b 1
    )
)

echo.
echo [3/3] Starting Flask server...
echo.
echo Server will run on: http://127.0.0.1:5000
echo Health check: http://127.0.0.1:5000/api/health
echo.
echo Press Ctrl+C to stop the server
echo.

venv\Scripts\python.exe app.py

pause

