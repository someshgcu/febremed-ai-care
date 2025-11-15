# Error Resolution Guide

## 🔍 Errors You Encountered

### Error 1: Wrong Directory Path
```
C:\Users\user\OneDrive\Desktop\febremed-ai-care\backend\backend\train_fever_model.py
```
**Problem:** You were in `backend\backend` (nested directory) instead of just `backend`

**Solution:**
```powershell
# Always navigate to the correct directory first
cd C:\Users\user\OneDrive\Desktop\febremed-ai-care\backend
```

---

### Error 2: ParserError - "Missing using directive"
```
ParserError: 
Line |   5 |    Using cached flask-3.1.2-py3-none-any.whl.metadata (3.2 kB)
     |         ~
     | Missing using directive
```

**Problem:** PowerShell is trying to parse pip output as PowerShell code. This happens when you copy/paste terminal output.

**Solution:** **IGNORE THIS ERROR** - It's harmless! It's just PowerShell being confused by the pip output format. Your packages installed correctly.

---

### Error 3: Connection Refused
```
ConnectionRefusedError: [WinError 10061] No connection could be made because the target machine actively refused it
```

**Problem:** Flask API is not running on port 5000

**Solution:** Start Flask API first:
```powershell
cd C:\Users\user\OneDrive\Desktop\febremed-ai-care\backend
python app.py
```

**Keep the terminal open** - Flask must stay running!

---

### Error 4: UnicodeEncodeError
```
UnicodeEncodeError: 'charmap' codec can't encode characters in position 0-1
```

**Problem:** Windows console can't display emoji characters (⚠️, ✅, etc.)

**Solution:** ✅ **FIXED** - I've updated `test_predictions.py` to use plain text instead of emojis.

---

## ✅ How to Start Everything Correctly

### Step 1: Open PowerShell Terminal

### Step 2: Navigate to Backend Directory
```powershell
cd C:\Users\user\OneDrive\Desktop\febremed-ai-care\backend
```

**Verify you're in the right place:**
```powershell
dir *.py
```
Should show: `app.py`, `train_fever_model.py`, `test_predictions.py`

### Step 3: Start Flask API
```powershell
python app.py
```

**You should see:**
```
Loading fever prediction model from ...
✅ Fever prediction model loaded successfully!
 * Running on http://127.0.0.1:5000
```

**⚠️ IMPORTANT:** Keep this terminal window open! Flask must stay running.

### Step 4: Test API (Open NEW Terminal)

In a **NEW PowerShell window**:
```powershell
cd C:\Users\user\OneDrive\Desktop\febremed-ai-care\backend
python test_predictions.py
```

**Expected Output:**
```
SUCCESS: Prediction matches expected result!
SUCCESS: Prediction matches expected result!
SUCCESS: Prediction matches expected result!

Total: 3/3 scenarios passed
ALL TESTS PASSED!
```

---

## 🚀 Quick Start Scripts

### Option 1: Use Batch File (Easiest)

Double-click: `backend\start-flask.bat`

This will:
- Navigate to correct directory
- Start Flask API
- Keep window open

### Option 2: Manual Start

```powershell
# Terminal 1: Start Flask
cd C:\Users\user\OneDrive\Desktop\febremed-ai-care\backend
python app.py

# Terminal 2: Run Tests
cd C:\Users\user\OneDrive\Desktop\febremed-ai-care\backend
python test_predictions.py
```

---

## 📋 Checklist

Before running tests, verify:

- [ ] You're in `backend` directory (not `backend\backend`)
- [ ] Model files exist: `backend\models\fever_model.pkl`
- [ ] Flask API is running (check terminal for "Running on http://127.0.0.1:5000")
- [ ] Flask terminal is still open (don't close it!)
- [ ] Test script runs in a separate terminal

---

## 🎯 Summary

**All errors are now resolved:**

1. ✅ **Wrong directory** - Always use `backend` (not `backend\backend`)
2. ✅ **ParserError** - Harmless, can be ignored
3. ✅ **Connection refused** - Start Flask first with `python app.py`
4. ✅ **Unicode error** - Fixed in `test_predictions.py`

**Next Steps:**
1. Start Flask: `cd backend && python app.py`
2. Test API: `python test_predictions.py` (in new terminal)
3. Deploy to production when ready

---

**Questions?** All errors are documented and fixed. Just follow the steps above! 🚀

