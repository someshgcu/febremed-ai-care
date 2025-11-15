# Test Python Setup - Complete Verification
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Python Setup Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Python Version
Write-Host "[1/6] Checking Python version..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Python not found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: Virtual Environment
Write-Host "[2/6] Checking virtual environment..." -ForegroundColor Yellow
$venvPython = "backend\venv\Scripts\python.exe"
if (Test-Path $venvPython) {
    $venvVersion = & $venvPython --version 2>&1
    Write-Host "✅ Virtual environment found: $venvVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Virtual environment not found at: $venvPython" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 3: Dependencies
Write-Host "[3/6] Checking dependencies..." -ForegroundColor Yellow
try {
    & $venvPython -c "import flask, flask_cors, PIL, pytesseract, google.generativeai, dotenv; print('✅ All dependencies available')" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ All dependencies installed correctly" -ForegroundColor Green
    } else {
        Write-Host "❌ Some dependencies missing" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error checking dependencies: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 4: Flask Import
Write-Host "[4/6] Testing Flask import..." -ForegroundColor Yellow
try {
    $flaskVersion = & $venvPython -c "import flask; print(flask.__version__)" 2>&1
    Write-Host "✅ Flask $flaskVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Flask not working" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 5: Environment Variables
Write-Host "[5/6] Checking .env file..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "GEMINI_API_KEY") {
        Write-Host "✅ GEMINI_API_KEY found in .env" -ForegroundColor Green
    } else {
        Write-Host "⚠️  GEMINI_API_KEY not found in .env (optional for health check)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  .env file not found (create it for GEMINI_API_KEY)" -ForegroundColor Yellow
}
Write-Host ""

# Test 6: Flask App File
Write-Host "[6/6] Checking Flask app..." -ForegroundColor Yellow
if (Test-Path "backend\app.py") {
    Write-Host "✅ Flask app.py found" -ForegroundColor Green
} else {
    Write-Host "❌ Flask app.py not found!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ All checks passed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Ready to start Flask server:" -ForegroundColor Cyan
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   .\venv\Scripts\python.exe app.py" -ForegroundColor Gray
Write-Host ""
Write-Host "Or use the batch file:" -ForegroundColor Cyan
Write-Host "   .\install-and-start-flask.bat" -ForegroundColor Gray
Write-Host ""


