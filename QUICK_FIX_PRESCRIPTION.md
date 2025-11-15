# 🚨 Quick Fix: Prescription Extraction Failed

## ✅ The Problem
The Flask server is **not running**, which is why file extraction fails.

## 🔧 Quick Solution (2 minutes)

### Step 1: Start Flask Server

**Option A: Using PowerShell Script (Easiest)**
```powershell
.\start-flask-server.ps1
```

**Option B: Manual Start**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python app.py
```

**Option C: Using Batch File**
```cmd
start-flask-server.bat
```

### Step 2: Verify It's Running

Open a new terminal and test:
```powershell
node test-prescription-api.js
```

Or check in browser: http://127.0.0.1:5000/api/health

Should return: `{"status": "healthy"}`

### Step 3: Test in Your App

1. Make sure Flask server is running (Step 1)
2. Make sure Vite dev server is running: `npm run dev`
3. Go to `/assessment` page
4. Upload a prescription image
5. Click "Extract Medication"

## ⚠️ Common Issues

### Issue: "Cannot connect to extraction service"
**Fix:** Flask server is not running. Start it with `.\start-flask-server.ps1`

### Issue: "GEMINI_API_KEY is not configured"
**Fix:** Add to `.env` file:
```env
GEMINI_API_KEY=your-gemini-api-key-here
```
Then restart Flask server.

### Issue: "Tesseract OCR is not installed"
**Fix:** 
1. Download from: https://github.com/UB-Mannheim/tesseract/wiki
2. Install it
3. If not in default location, add to `.env`:
```env
TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe
```

### Issue: Dependencies missing
**Fix:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## 📋 Complete Checklist

- [ ] Flask server is running (`python app.py` in backend directory)
- [ ] Flask server accessible at http://127.0.0.1:5000/api/health
- [ ] `.env` file has `GEMINI_API_KEY`
- [ ] Tesseract OCR is installed
- [ ] Vite dev server is running (`npm run dev`)
- [ ] Test extraction in `/assessment` page

## 🎯 Expected Behavior

When everything works:
1. User uploads image → Frontend sends to `/api/extract-medication`
2. Vite proxies to Flask at `http://127.0.0.1:5000`
3. Flask extracts text with Tesseract
4. Flask analyzes with Gemini
5. Flask returns medication data
6. Frontend displays extracted info ✅

---

**Most Important:** Start the Flask server! That's the #1 reason extraction fails.

Run: `.\start-flask-server.ps1` or `start-flask-server.bat`


