# Quick Start - Complete Demo

## ✅ Current Status

- ✅ Flask API: Running on port 5000
- ✅ Model: Loaded and ready
- ✅ ngrok: Should be running (check Terminal 2)
- ✅ Edge Function: Deployed to Supabase
- ⏳ Frontend: Starting...

---

## 🚀 Quick Start (3 Steps)

### Step 1: Verify Flask is Running

**Check Terminal 1:**
- Should show: "Running on http://127.0.0.1:5000"
- Should show: "Fever prediction model loaded successfully!"

**If not running, start it:**
```powershell
cd C:\Users\user\OneDrive\Desktop\febremed-ai-care\backend
python app.py
```

---

### Step 2: Verify ngrok is Running

**Check Terminal 2:**
- Should show: "Session Status: online"
- Should show: "Forwarding https://xxx.ngrok.io -> http://localhost:5000"

**If not running, start it:**
```powershell
& "C:\Program Files\ngrok.exe" http 5000
```

**Your ngrok URL:** `https://pitiably-nonindependent-tera.ngrok-free.dev`

**⚠️ If URL changed:** Update Supabase secret `PYTHON_API_URL`

---

### Step 3: Start Frontend

**Frontend should be starting now...**

**Wait for:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

**Then open:** http://localhost:5173

---

## 🧪 Test the Complete Flow

### 1. Open Frontend
- Browser: http://localhost:5173
- Should see homepage

### 2. Go to Assessment
- Click "Start Assessment" or navigate to `/assessment`

### 3. Fill Form (Test Scenario 1)
```
Temperature: 39.2
Age: 28
Duration: 3 days
Medication Type: Antipyretic
Days on Medication: 2
Compliance: 85%
Symptoms: Headache, Body ache, Fatigue
Location: Mumbai (or any)
```

### 4. Submit
- Click "Submit Assessment"
- Should see loading
- Should redirect to Results page

### 5. Verify Results
- ✅ Decision shown (e.g., "CONTINUE")
- ✅ Confidence score (e.g., 98.19%)
- ✅ Explanation displayed
- ✅ Key factors listed
- ✅ Probabilities shown

---

## 🔍 Verify Everything Works

### Test 1: Flask Health
```powershell
curl http://localhost:5000/api/health
```
Should return: `{"status":"healthy","fever_model_loaded":true}`

### Test 2: ngrok Health
Open in browser:
```
https://pitiably-nonindependent-tera.ngrok-free.dev/api/health
```
Should return: `{"status":"healthy","fever_model_loaded":true}`

### Test 3: Supabase Logs
1. Go to: Supabase Dashboard → Edge Functions → Logs
2. Submit assessment from frontend
3. Check logs for successful API calls

### Test 4: Browser Console
1. Open http://localhost:5173
2. Press F12 → Console tab
3. Submit assessment
4. Should see no errors

---

## ✅ Success Checklist

- [ ] Flask API running (Terminal 1)
- [ ] ngrok running (Terminal 2)
- [ ] Frontend running (Terminal 3)
- [ ] Frontend opens in browser
- [ ] Assessment form loads
- [ ] Form submission works
- [ ] Results page shows prediction
- [ ] No errors in browser console
- [ ] Supabase logs show API calls

---

## 🎬 Demo Script

1. **Show Homepage**
   - Explain the fever prediction system

2. **Navigate to Assessment**
   - Show the form fields
   - Explain what each field means

3. **Fill Test Data**
   - Use Scenario 1 data
   - Show form validation

4. **Submit Assessment**
   - Show loading state
   - Explain the flow: Frontend → Supabase → Flask API → Model → Results

5. **Show Results**
   - Display prediction
   - Explain confidence score
   - Show probabilities
   - Explain recommendations

6. **Try Other Scenarios**
   - Test Scenario 2 (CONSULT_DOCTOR)
   - Test Scenario 3 (LIKELY_SAFE_TO_STOP)

---

## 🐛 Quick Fixes

**Frontend won't start?**
- Check: `npm install` completed
- Check: Port 5173 not in use
- Try: `npm run dev` again

**No prediction received?**
- Check: Supabase secret `PYTHON_API_URL` is set
- Check: ngrok URL matches secret
- Check: Flask is running
- Check: Supabase edge function logs

**Connection errors?**
- Check: All 3 terminals running
- Check: ngrok forwarding correctly
- Check: Browser console for errors

---

**Frontend should be starting now! Open http://localhost:5173 when ready!** 🚀

