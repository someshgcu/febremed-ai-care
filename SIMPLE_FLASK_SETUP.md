# Simple Flask Setup - Step by Step

## 🎯 Quick Fix (Copy & Paste)

### Step 1: Navigate to Backend
```powershell
cd backend
```

### Step 2: Activate Virtual Environment
```powershell
# If you get execution policy error, type 'R' to run once, or use:
.\venv\Scripts\python.exe -m pip install Flask Flask-Cors Pillow pytesseract google-generativeai python-dotenv
```

### Step 3: Install Dependencies (If Step 2 didn't work)
```powershell
# Use Python directly from venv (no activation needed)
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install Flask Flask-Cors Pillow pytesseract google-generativeai python-dotenv
```

### Step 4: Start Flask Server
```powershell
.\venv\Scripts\python.exe app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
```

## ✅ Verify It Works

Open a new terminal and run:
```powershell
node test-prescription-api.js
```

Or visit: http://127.0.0.1:5000/api/health

## 🔧 If You Get Errors

### Error: "ModuleNotFoundError: No module named 'dotenv'"
**Fix:** Run Step 3 above to install dependencies

### Error: Execution Policy
**Fix:** When prompted, type `R` (Run once) or use the direct Python path method in Step 2

### Error: Pillow installation fails
**Fix:** Try installing pre-built wheel:
```powershell
.\venv\Scripts\python.exe -m pip install --upgrade pip setuptools wheel
.\venv\Scripts\python.exe -m pip install --only-binary :all: Pillow
.\venv\Scripts\python.exe -m pip install Flask Flask-Cors pytesseract google-generativeai python-dotenv
```

## 📋 Complete Command Sequence

Copy and paste this entire block:

```powershell
cd backend
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install Flask Flask-Cors Pillow pytesseract google-generativeai python-dotenv
.\venv\Scripts\python.exe app.py
```

That's it! Flask should start running. 🎉

---

**Keep this terminal open** - Flask needs to keep running for extraction to work!


