# Local Demo Setup Guide

Complete step-by-step guide to run a local demo of the fever prediction system.

---

## 🎯 Overview

For a local demo, you need:
1. ✅ **Flask API** running (already done!)
2. 🔗 **ngrok** to expose Flask API publicly (so Supabase can reach it)
3. ⚙️ **Supabase** edge function configured with ngrok URL
4. 🎨 **Frontend** running locally

---

## 📋 Prerequisites Checklist

- [x] Flask API running on port 5000
- [x] Model trained and loaded
- [ ] ngrok installed
- [ ] Supabase account and project
- [ ] Node.js installed (for frontend)

---

## 🚀 Step-by-Step Setup

### STEP 1: Install ngrok

**Option A: Download (Recommended)**
1. Go to https://ngrok.com/download
2. Download for Windows
3. Extract `ngrok.exe` to a folder (e.g., `C:\ngrok\`)
4. Add to PATH or use full path

**Option B: Using Chocolatey**
```powershell
choco install ngrok
```

**Option C: Using Scoop**
```powershell
scoop install ngrok
```

**Verify installation:**
```powershell
ngrok version
```

---

### STEP 2: Start Flask API (If Not Running)

Open **Terminal 1**:
```powershell
cd C:\Users\user\OneDrive\Desktop\febremed-ai-care\backend
python app.py
```

**Keep this terminal open!** Flask must stay running.

**Verify it's working:**
- You should see: `* Running on http://127.0.0.1:5000`
- Model should be loaded: `✅ Fever prediction model loaded successfully!`

---

### STEP 3: Start ngrok Tunnel

Open **Terminal 2** (NEW terminal):
```powershell
ngrok http 5000
```

**You'll see:**
```
Forwarding  https://abc123xyz.ngrok.io -> http://localhost:5000
```

**⚠️ IMPORTANT:** Copy the HTTPS URL (e.g., `https://abc123xyz.ngrok.io`)

**Keep this terminal open!** ngrok must stay running.

---

### STEP 4: Configure Supabase Edge Function

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Set Environment Secret:**
   - Go to: **Project Settings** → **Edge Functions** → **Secrets**
   - Click **Add Secret**
   - **Name:** `PYTHON_API_URL`
   - **Value:** Your ngrok URL (e.g., `https://abc123xyz.ngrok.io`)
   - Click **Save**

3. **Deploy Edge Function (if not already deployed):**
   ```powershell
   # In project root
   supabase functions deploy analyze-fever
   ```

   Or use Supabase Dashboard:
   - Go to **Edge Functions**
   - Select `analyze-fever`
   - Click **Deploy**

---

### STEP 5: Start Frontend

Open **Terminal 3** (NEW terminal):
```powershell
cd C:\Users\user\OneDrive\Desktop\febremed-ai-care
npm install  # Only needed first time
npm run dev
```

**You'll see:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Open browser:** http://localhost:5173

---

## ✅ Verification Checklist

### Check 1: Flask API
```powershell
curl http://localhost:5000/api/health
```
**Expected:** `{"status":"healthy","fever_model_loaded":true}`

### Check 2: ngrok Tunnel
- Visit your ngrok URL in browser: `https://abc123xyz.ngrok.io/api/health`
- Should return: `{"status":"healthy","fever_model_loaded":true}`

### Check 3: Supabase Edge Function
- Go to Supabase Dashboard → Edge Functions → Logs
- Check for any errors

### Check 4: Frontend
- Open http://localhost:5173
- Should see the homepage

---

## 🎬 Running the Demo

### Demo Flow:

1. **Navigate to Assessment Page**
   - Click "Start Assessment" or go to `/assessment`

2. **Fill in Patient Data:**
   - Temperature: `39.2`
   - Age: `28`
   - Duration: `3` days
   - Medication Type: `Antipyretic`
   - Compliance: `85%`
   - Select symptoms: Headache, Body ache, Fatigue

3. **Submit Assessment**
   - Click "Submit Assessment"
   - Frontend calls Supabase edge function
   - Edge function calls Flask API via ngrok
   - Flask API returns prediction
   - Results displayed on Results page

4. **View Results**
   - See prediction: `CONTINUE`, `CONSULT_DOCTOR`, or `LIKELY_SAFE_TO_STOP`
   - View confidence score
   - See explanation and recommendations

---

## 🔧 Troubleshooting

### Issue: ngrok URL Not Working

**Problem:** Can't access Flask API via ngrok

**Solutions:**
1. Make sure Flask is running on port 5000
2. Check ngrok is forwarding to correct port
3. Try restarting ngrok: `ngrok http 5000`
4. Check Windows Firewall isn't blocking

---

### Issue: Supabase Can't Reach Flask API

**Problem:** Edge function returns connection error

**Solutions:**
1. **Verify ngrok URL is correct:**
   - Test in browser: `https://your-ngrok-url.ngrok.io/api/health`
   - Should return JSON response

2. **Check Supabase secret:**
   - Go to Dashboard → Edge Functions → Secrets
   - Verify `PYTHON_API_URL` is set correctly
   - Use HTTPS URL (not HTTP)

3. **Check edge function logs:**
   - Supabase Dashboard → Edge Functions → Logs
   - Look for error messages

4. **Redeploy edge function:**
   ```powershell
   supabase functions deploy analyze-fever
   ```

---

### Issue: Frontend Can't Connect

**Problem:** Frontend shows connection errors

**Solutions:**
1. **Check Flask is running:**
   ```powershell
   curl http://localhost:5000/api/health
   ```

2. **Check ngrok is running:**
   - Terminal should show "Forwarding" message
   - Visit ngrok URL in browser

3. **Check browser console:**
   - Press F12 → Console tab
   - Look for error messages

---

### Issue: Model Not Loading

**Problem:** Flask shows "Model not loaded"

**Solutions:**
1. **Re-train model:**
   ```powershell
   cd backend
   python train_fever_model.py
   ```

2. **Verify model files exist:**
   ```powershell
   dir backend\models\
   ```
   Should show: `fever_model.pkl`, `label_encoder.pkl`, `feature_names.json`

---

## 📊 Demo Scenarios

### Scenario 1: High Fever - Should CONTINUE
- Temperature: `39.2`
- Duration: `3` days
- Compliance: `85%`
- Symptoms: Headache, Body ache, Fatigue
- **Expected:** `CONTINUE`

### Scenario 2: Low Compliance - Should CONSULT_DOCTOR
- Temperature: `38.0`
- Duration: `4` days
- Compliance: `60%`
- Symptoms: Headache
- **Expected:** `CONSULT_DOCTOR`

### Scenario 3: Recovering - Should LIKELY_SAFE_TO_STOP
- Temperature: `37.1`
- Duration: `7` days
- Compliance: `95%`
- Symptoms: None
- **Expected:** `LIKELY_SAFE_TO_STOP`

---

## 🎯 Quick Start Commands

**Terminal 1 - Flask API:**
```powershell
cd C:\Users\user\OneDrive\Desktop\febremed-ai-care\backend
python app.py
```

**Terminal 2 - ngrok:**
```powershell
ngrok http 5000
# Copy the HTTPS URL
```

**Terminal 3 - Frontend:**
```powershell
cd C:\Users\user\OneDrive\Desktop\febremed-ai-care
npm run dev
```

---

## 📝 Important Notes

1. **Keep all 3 terminals open** - Flask, ngrok, and frontend must stay running

2. **ngrok URL changes** - Free ngrok URLs change each time you restart. Update Supabase secret if you restart ngrok.

3. **ngrok free tier limits:**
   - 40 connections/minute
   - 2 hours session timeout
   - For longer demos, consider ngrok paid plan or deploy to Render/Railway

4. **Supabase secrets:**
   - Secrets are project-wide
   - Changes take effect immediately (no redeploy needed)

---

## 🎉 Success Indicators

You're ready to demo when:

- ✅ Flask API running on port 5000
- ✅ ngrok forwarding to Flask
- ✅ Supabase secret `PYTHON_API_URL` set to ngrok URL
- ✅ Frontend running on http://localhost:5173
- ✅ Can access ngrok URL in browser
- ✅ Health check returns model loaded: `true`

---

## 🚀 Next Steps After Demo

1. **For Production:**
   - Deploy Flask API to Render/Railway
   - Update Supabase secret with production URL
   - Deploy frontend to Vercel/Netlify

2. **For Longer Demos:**
   - Use ngrok paid plan (static domains)
   - Or deploy Flask API to cloud

---

**Ready to demo?** Follow the steps above and you'll have a fully working local demo! 🎬

