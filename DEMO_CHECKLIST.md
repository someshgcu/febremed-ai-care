# Local Demo Checklist

Use this checklist to ensure everything is set up correctly for your demo.

---

## ✅ Pre-Demo Setup

### 1. Flask API
- [ ] Navigate to `backend` directory
- [ ] Run `python app.py`
- [ ] See "Fever prediction model loaded successfully!"
- [ ] See "Running on http://127.0.0.1:5000"
- [ ] **Keep terminal open**

### 2. ngrok Tunnel
- [ ] Install ngrok (if not installed)
- [ ] Run `ngrok http 5000`
- [ ] See "Forwarding https://xxx.ngrok.io -> http://localhost:5000"
- [ ] Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
- [ ] **Keep terminal open**

### 3. Supabase Configuration
- [ ] Go to Supabase Dashboard
- [ ] Navigate to: Project Settings → Edge Functions → Secrets
- [ ] Add/Update secret:
  - Name: `PYTHON_API_URL`
  - Value: Your ngrok HTTPS URL
- [ ] Save secret
- [ ] Verify edge function is deployed

### 4. Frontend
- [ ] Navigate to project root
- [ ] Run `npm install` (if first time)
- [ ] Run `npm run dev`
- [ ] See "Local: http://localhost:5173"
- [ ] **Keep terminal open**

---

## ✅ Verification Tests

### Test 1: Flask API Health
```powershell
curl http://localhost:5000/api/health
```
- [ ] Returns: `{"status":"healthy","fever_model_loaded":true}`

### Test 2: ngrok Tunnel
- [ ] Open ngrok URL in browser: `https://your-url.ngrok.io/api/health`
- [ ] Returns: `{"status":"healthy","fever_model_loaded":true}`

### Test 3: Supabase Edge Function
- [ ] Go to Supabase Dashboard → Edge Functions → Logs
- [ ] No connection errors visible

### Test 4: Frontend
- [ ] Open http://localhost:5173
- [ ] Homepage loads correctly
- [ ] No console errors (F12 → Console)

---

## ✅ Demo Flow Test

### Test Assessment Submission
1. [ ] Navigate to Assessment page
2. [ ] Fill in form:
   - Temperature: `39.2`
   - Age: `28`
   - Duration: `3`
   - Medication: `Antipyretic`
   - Compliance: `85%`
   - Symptoms: Headache, Body ache, Fatigue
3. [ ] Click "Submit Assessment"
4. [ ] See loading indicator
5. [ ] Redirected to Results page
6. [ ] See prediction result
7. [ ] See confidence score
8. [ ] See explanation

---

## ✅ All Systems Running

Before starting demo, verify:

- [ ] **Terminal 1:** Flask API running (port 5000)
- [ ] **Terminal 2:** ngrok tunnel active (HTTPS URL visible)
- [ ] **Terminal 3:** Frontend dev server running (port 5173)
- [ ] **Supabase:** Secret `PYTHON_API_URL` set correctly
- [ ] **Browser:** Frontend accessible at http://localhost:5173

---

## 🎬 Demo Script

### Opening
1. Show homepage
2. Explain the fever prediction system
3. Navigate to Assessment page

### Assessment
1. Fill in patient data
2. Show form validation
3. Submit assessment
4. Show loading state

### Results
1. Show prediction decision
2. Explain confidence score
3. Show probabilities
4. Show recommendations
5. Show key factors

### Additional Features
1. Show History page (if data exists)
2. Show Report page
3. Explain model accuracy (93.40%)

---

## 🐛 Common Issues & Quick Fixes

### Flask Not Running
- **Fix:** Start Flask: `cd backend && python app.py`

### ngrok Not Working
- **Fix:** Restart ngrok: `ngrok http 5000`
- **Check:** Windows Firewall settings

### Supabase Connection Error
- **Fix:** Verify `PYTHON_API_URL` secret is set
- **Fix:** Test ngrok URL in browser first
- **Fix:** Redeploy edge function

### Frontend Errors
- **Fix:** Check browser console (F12)
- **Fix:** Verify Flask is running
- **Fix:** Clear browser cache

---

## 📊 Demo Data

### Quick Test Scenarios

**Scenario 1: CONTINUE**
```
Temperature: 39.2
Age: 28
Duration: 3 days
Compliance: 85%
Symptoms: Headache, Body ache, Fatigue
Expected: CONTINUE (98% confidence)
```

**Scenario 2: CONSULT_DOCTOR**
```
Temperature: 38.0
Age: 35
Duration: 4 days
Compliance: 60%
Symptoms: Headache
Expected: CONSULT_DOCTOR (75% confidence)
```

**Scenario 3: LIKELY_SAFE_TO_STOP**
```
Temperature: 37.1
Age: 25
Duration: 7 days
Compliance: 95%
Symptoms: None
Expected: LIKELY_SAFE_TO_STOP (96% confidence)
```

---

## ✅ Final Check

Before demo:

- [ ] All 3 terminals running
- [ ] All verification tests pass
- [ ] Test assessment submission works
- [ ] Results page displays correctly
- [ ] No console errors
- [ ] ngrok URL is stable (not expired)

---

**Ready to demo!** 🎉

Follow the demo script above and you'll have a smooth presentation.

