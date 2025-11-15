# Complete Project Test Guide

## 🎯 Testing the Complete Integration

Follow these steps to test the entire system end-to-end.

---

## ✅ Prerequisites Checklist

Before starting, verify:

- [x] Edge function deployed to Supabase
- [x] `PYTHON_API_URL` secret set in Supabase
- [ ] Flask API ready to start
- [ ] ngrok ready to start
- [ ] Frontend ready to start

---

## 🚀 Step-by-Step: Start Everything

### Terminal 1: Flask API

**Open PowerShell and run:**
```powershell
cd C:\Users\user\OneDrive\Desktop\febremed-ai-care\backend
python app.py
```

**Wait for:**
- ✅ "Fever prediction model loaded successfully!"
- ✅ "Running on http://127.0.0.1:5000"

**Keep this terminal open!**

---

### Terminal 2: ngrok Tunnel

**Open a NEW PowerShell and run:**
```powershell
& "C:\Program Files\ngrok.exe" http 5000
```

**Wait for:**
- ✅ "Session Status: online"
- ✅ "Forwarding https://xxx.ngrok.io -> http://localhost:5000"

**Copy the HTTPS URL** (if different from before)

**Keep this terminal open!**

**⚠️ If URL changed:** Update Supabase secret `PYTHON_API_URL` with new URL

---

### Terminal 3: Frontend

**Open a NEW PowerShell and run:**
```powershell
cd C:\Users\user\OneDrive\Desktop\febremed-ai-care
npm run dev
```

**Wait for:**
- ✅ "Local: http://localhost:5173"

**Keep this terminal open!**

---

## 🧪 Testing the Complete Flow

### Step 1: Open Frontend

1. **Open browser:** http://localhost:5173
2. **Navigate to Assessment page:**
   - Click "Start Assessment" or go to `/assessment`

### Step 2: Fill Assessment Form

**Test Scenario 1: Should CONTINUE**
- Temperature: `39.2`
- Age: `28`
- Duration: `3` days
- Medication Type: `Antipyretic`
- Medication Name: `Paracetamol` (optional)
- Days on Medication: `2`
- Compliance: `85%`
- Symptoms: Select **Headache**, **Body ache**, **Fatigue**
- Comorbidities: None (leave empty)
- Location: Any (e.g., `Mumbai`)

### Step 3: Submit Assessment

1. **Click "Submit Assessment"**
2. **Watch for:**
   - Loading indicator
   - Redirect to Results page
   - Prediction displayed

### Step 4: Verify Results

**You should see:**
- ✅ Decision: `CONTINUE` (or appropriate decision)
- ✅ Confidence score (e.g., 98.19%)
- ✅ Explanation
- ✅ Key factors
- ✅ Next steps
- ✅ Probabilities for all 3 classes

---

## 🔍 Debugging & Verification

### Check 1: Flask API

**In browser or PowerShell:**
```powershell
curl http://localhost:5000/api/health
```

**Should return:**
```json
{"status":"healthy","fever_model_loaded":true}
```

---

### Check 2: ngrok Tunnel

**In browser:**
```
https://pitiably-nonindependent-tera.ngrok-free.dev/api/health
```

**Should return:**
```json
{"status":"healthy","fever_model_loaded":true}
```

---

### Check 3: Supabase Edge Function

1. **Go to:** Supabase Dashboard → Edge Functions → Logs
2. **Submit an assessment from frontend**
3. **Check logs:**
   - Should see: "Calling Python API at: https://..."
   - Should see: "Prediction received: CONTINUE (confidence: ...)"
   - No errors

---

### Check 4: Browser Console

1. **Open browser:** http://localhost:5173
2. **Press F12** → Console tab
3. **Submit assessment**
4. **Check for:**
   - No red errors
   - API calls successful
   - Data received

---

## 🐛 Troubleshooting

### Issue: Frontend Shows Error

**Check:**
1. Flask API is running (Terminal 1)
2. ngrok is running (Terminal 2)
3. Supabase secret is set correctly
4. Edge function is deployed

**Fix:**
- Check browser console (F12) for specific errors
- Check Supabase edge function logs
- Verify ngrok URL is accessible

---

### Issue: No Prediction Received

**Check:**
1. Supabase edge function logs
2. Flask API logs (Terminal 1)
3. ngrok is forwarding correctly

**Fix:**
- Verify `PYTHON_API_URL` secret is set
- Test ngrok URL directly in browser
- Check Flask is responding

---

### Issue: Connection Errors

**Check:**
1. All 3 terminals are running
2. Flask on port 5000
3. ngrok forwarding to port 5000
4. Frontend on port 5173

**Fix:**
- Restart any stopped services
- Check Windows Firewall
- Verify ports aren't blocked

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ **Frontend loads** without errors
2. ✅ **Assessment form** submits successfully
3. ✅ **Results page** shows prediction
4. ✅ **Confidence score** is displayed
5. ✅ **No console errors** in browser
6. ✅ **Supabase logs** show successful API calls

---

## 🎬 Demo Flow

1. **Show homepage** → Explain the system
2. **Navigate to Assessment** → Show form
3. **Fill in test data** → Explain fields
4. **Submit** → Show loading
5. **Results page** → Show prediction, confidence, explanation
6. **Explain model** → 93.40% accuracy, XGBoost
7. **Show different scenarios** → Try other test cases

---

## 📊 Test Scenarios

### Scenario 1: CONTINUE
- Temp: 39.2, Duration: 3, Compliance: 85%
- Expected: CONTINUE (~98% confidence)

### Scenario 2: CONSULT_DOCTOR
- Temp: 38.0, Duration: 4, Compliance: 60%
- Expected: CONSULT_DOCTOR (~75% confidence)

### Scenario 3: LIKELY_SAFE_TO_STOP
- Temp: 37.1, Duration: 7, Compliance: 95%
- Expected: LIKELY_SAFE_TO_STOP (~96% confidence)

---

**Ready to test!** Follow the steps above and you'll have a complete working demo! 🚀

