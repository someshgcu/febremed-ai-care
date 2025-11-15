@echo off
REM Quick Start Script for Fever Prediction API (Windows)
REM This script trains the model, starts the API, and runs tests

echo ==========================================
echo Fever Prediction API - Quick Start
echo ==========================================
echo.

REM Check if we're in the backend directory
if not exist "app.py" (
    echo [ERROR] Please run this script from the backend\ directory
    exit /b 1
)

REM Step 1: Install dependencies
echo [Step 1] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Step 2: Train model
echo [Step 2] Training XGBoost model...
python train_fever_model.py
if errorlevel 1 (
    echo [ERROR] Model training failed
    exit /b 1
)
echo [OK] Model trained
echo.

REM Step 3: Check if model files exist
if not exist "models\fever_model.pkl" (
    echo [ERROR] Model file not found. Training may have failed.
    exit /b 1
)
echo [OK] Model files verified
echo.

REM Step 4: Start Flask API
echo [Step 3] Starting Flask API...
echo [INFO] Flask API will start in a new window
echo [INFO] Keep it running and return here to run tests
echo.
start "Flask API" cmd /k "python app.py"
timeout /t 5 /nobreak >nul
echo [OK] Flask API should be starting...
echo.

REM Step 5: Run tests
echo [Step 4] Running validation tests...
echo [INFO] Make sure Flask API is running before continuing
pause
python test_predictions.py
if errorlevel 1 (
    echo.
    echo ==========================================
    echo [WARNING] Some tests failed
    echo ==========================================
    exit /b 1
)
echo.

REM Step 6: Summary
echo ==========================================
echo [SUCCESS] All tests passed!
echo ==========================================
echo.
echo [OK] Model trained and loaded
echo [OK] Flask API running on http://localhost:5000
echo [OK] All validation scenarios passed
echo.
echo Next steps:
echo 1. Keep Flask API running
echo 2. Configure Supabase edge function with PYTHON_API_URL
echo 3. Test from frontend
echo.

