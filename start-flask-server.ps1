# PowerShell script to start Flask server for prescription extraction
# Usage: .\start-flask-server.ps1

Write-Host "🚀 Starting Flask server for prescription extraction..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $scriptDir "backend"
$appPath = Join-Path $backendPath "app.py"

if (-not (Test-Path $appPath)) {
    Write-Host "❌ Error: backend\app.py not found!" -ForegroundColor Red
    Write-Host "   Please run this script from the project root directory." -ForegroundColor Yellow
    Write-Host "   Current directory: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}

# Navigate to backend directory
Push-Location $backendPath

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "⚠️  Virtual environment not found. Creating one..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✅ Virtual environment created." -ForegroundColor Green
}

# Activate virtual environment
Write-Host "📦 Activating virtual environment..." -ForegroundColor Cyan

# Bypass execution policy for venv activation
$originalPolicy = Get-ExecutionPolicy -Scope Process
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

try {
    & "venv\Scripts\Activate.ps1"
} catch {
    # If activation fails, use direct Python path
    Write-Host "⚠️  Activation script blocked, using direct Python path..." -ForegroundColor Yellow
    $env:VIRTUAL_ENV = (Resolve-Path "venv").Path
    $env:PATH = "$env:VIRTUAL_ENV\Scripts;$env:PATH"
}

# Restore original policy
Set-ExecutionPolicy -ExecutionPolicy $originalPolicy -Scope Process -Force

# Check if dependencies are installed
Write-Host "🔍 Checking dependencies..." -ForegroundColor Cyan
$pythonExe = "venv\Scripts\python.exe"
if (-not (Test-Path $pythonExe)) {
    Write-Host "❌ Python executable not found in venv!" -ForegroundColor Red
    Write-Host "   Recreating virtual environment..." -ForegroundColor Yellow
    python -m venv venv --clear
    $pythonExe = "venv\Scripts\python.exe"
}

$requirementsCheck = & $pythonExe -c "import flask, flask_cors, PIL, pytesseract, google.generativeai, dotenv" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Some dependencies are missing. Installing..." -ForegroundColor Yellow
    & $pythonExe -m pip install --upgrade pip
    & $pythonExe -m pip install -r requirements.txt
    Write-Host "✅ Dependencies installed." -ForegroundColor Green
} else {
    Write-Host "✅ All dependencies are installed." -ForegroundColor Green
}

# Check for .env file
if (-not (Test-Path "..\.env")) {
    Write-Host "⚠️  Warning: .env file not found in project root!" -ForegroundColor Yellow
    Write-Host "   The Flask server needs GEMINI_API_KEY in .env file." -ForegroundColor Yellow
    Write-Host "   Create .env file with: GEMINI_API_KEY=your-key-here" -ForegroundColor Yellow
    Write-Host ""
}

# Check for Tesseract
Write-Host "🔍 Checking Tesseract OCR..." -ForegroundColor Cyan
try {
    $tesseractVersion = python -c "import pytesseract; print(pytesseract.get_tesseract_version())" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Tesseract OCR is installed: $tesseractVersion" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Tesseract OCR not found. Prescription extraction may not work." -ForegroundColor Yellow
        Write-Host "   Install from: https://github.com/UB-Mannheim/tesseract/wiki" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not verify Tesseract installation." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎯 Starting Flask server..." -ForegroundColor Cyan
Write-Host "   Server will run on: http://127.0.0.1:5000" -ForegroundColor Gray
Write-Host "   Health check: http://127.0.0.1:5000/api/health" -ForegroundColor Gray
Write-Host "   Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

# Start Flask server using venv Python
& $pythonExe app.py

# Return to original directory when script exits
Pop-Location

