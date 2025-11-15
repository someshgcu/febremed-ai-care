# How to Start Flask API - Quick Guide

## ⚠️ Common Errors Fixed

### Error 1: Wrong Directory
**Problem:** You're in `backend\backend` instead of `backend`

**Solution:**
```powershell
# Make sure you're in the correct directory
cd C:\Users\user\OneDrive\Desktop\febremed-ai-care\backend
```

### Error 2: ParserError (PowerShell)
**Problem:** PowerShell tries to parse pip output as code

**Solution:** This is harmless - just ignore it. It happens when you copy/paste terminal output.

---

## 🚀 Step-by-Step: Start Flask API

### Option 1: Start in Current Terminal (Recommended)

1. **Open a NEW PowerShell terminal**
2. **Navigate to backend directory:**
   ```powershell
   cd C:\Users\user\OneDrive\Desktop\febremed-ai-care\backend
   ```

3. **Start Flask server:**
   ```powershell
   python app.py
   ```

4. **You should see:**
   ```
   * Running on http://127.0.0.1:5000
   * Loading fever prediction model...
   * ✅ Fever prediction model loaded successfully!
   ```

5. **Keep this terminal open** - Flask is now running!

### Option 2: Start in Background (Windows)

1. **Open a NEW PowerShell terminal**
2. **Navigate to backend:**
   ```powershell
   cd C:\Users\user\OneDrive\Desktop\febremed-ai-care\backend
   ```

3. **Start Flask in new window:**
   ```powershell
   Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\user\OneDrive\Desktop\febremed-ai-care\backend'; python app.py"
   ```

---

## ✅ Verify Flask is Running

### Test 1: Check Health Endpoint

Open a **NEW terminal** and run:
```powershell
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{"status":"healthy","fever_model_loaded":true}
```

### Test 2: Run Test Script

In a **NEW terminal**:
```powershell
cd C:\Users\user\OneDrive\Desktop\febremed-ai-care\backend
python test_predictions.py
```

**Expected Output:**
```
✅ SUCCESS: Prediction matches expected result!
✅ SUCCESS: Prediction matches expected result!
✅ SUCCESS: Prediction matches expected result!

Total: 3/3 scenarios passed
🎉 ALL TESTS PASSED!
```

---

## 🔧 Troubleshooting

### Flask Won't Start?

1. **Check if port 5000 is in use:**
   ```powershell
   netstat -ano | findstr :5000
   ```
   If something is using port 5000, kill it or change Flask port.

2. **Check if model files exist:**
   ```powershell
   dir backend\models\
   ```
   Should show: `fever_model.pkl`, `label_encoder.pkl`, `feature_names.json`

3. **Re-train model if needed:**
   ```powershell
   cd backend
   python train_fever_model.py
   ```

### Connection Refused Error?

- Make sure Flask is running (check terminal)
- Make sure you're using `http://localhost:5000` (not `https://`)
- Check Windows Firewall isn't blocking port 5000

---

## 📋 Quick Checklist

- [ ] Navigate to `backend` directory (not `backend\backend`)
- [ ] Run `python app.py`
- [ ] See "Fever prediction model loaded successfully!" message
- [ ] Keep terminal open (Flask must stay running)
- [ ] Test with `curl http://localhost:5000/api/health`
- [ ] Run `python test_predictions.py` in another terminal

---

## 🎯 Next Steps After Flask is Running

1. **Test API:** Run `python test_predictions.py`
2. **Deploy to production** (Render/Railway/ngrok)
3. **Update Supabase** with API URL
4. **Test from frontend**

---

**Need help?** Check the error messages - they usually tell you exactly what's wrong!

