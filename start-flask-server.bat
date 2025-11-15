@echo off
echo Starting Flask server for prescription extraction...
echo.

cd backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Checking dependencies...
python -c "import flask" 2>nul
if errorlevel 1 (
    echo Installing dependencies...
    pip install -r requirements.txt
)

echo.
echo Starting Flask server on http://127.0.0.1:5000
echo Press Ctrl+C to stop
echo.

python app.py


