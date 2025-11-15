# ngrok Setup - Quick Guide

## ✅ ngrok is Installed!

You have ngrok installed at: `C:\Program Files\ngrok.exe`

---

## 🚀 Start ngrok Tunnel

### Option 1: Using Batch File (Easiest)

**Double-click:** `START_NGROK.bat`

This will start ngrok and tunnel port 5000.

---

### Option 2: Using Command Line

**Open PowerShell and run:**
```powershell
"C:\Program Files\ngrok.exe" http 5000
```

**Or if ngrok is in your PATH:**
```powershell
ngrok http 5000
```

---

## 📋 What You'll See

When ngrok starts, you'll see something like:

```
ngrok                                                                        

Session Status                online
Account                       Your Name (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123xyz.ngrok.io -> http://localhost:5000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**⚠️ IMPORTANT:** Copy the HTTPS URL from the "Forwarding" line:
- Example: `https://abc123xyz.ngrok.io`
- This is what you'll use in Supabase!

---

## 🔧 Next Steps

### Step 1: Keep ngrok Running
- **Don't close the ngrok window!** It must stay running.
- The tunnel is active as long as ngrok is running.

### Step 2: Copy the HTTPS URL
- Look for the "Forwarding" line
- Copy the HTTPS URL (e.g., `https://abc123xyz.ngrok.io`)

### Step 3: Set in Supabase
1. Go to Supabase Dashboard
2. **Project Settings** → **Edge Functions** → **Secrets**
3. Add/Edit secret:
   - **Name:** `PYTHON_API_URL`
   - **Value:** Your ngrok HTTPS URL (e.g., `https://abc123xyz.ngrok.io`)
4. Click **Save**

### Step 4: Test
- Visit your ngrok URL in browser: `https://your-url.ngrok.io/api/health`
- Should return: `{"status":"healthy","fever_model_loaded":true}`

---

## ⚠️ Important Notes

1. **ngrok URL Changes:**
   - Free ngrok URLs change each time you restart
   - If you restart ngrok, update Supabase secret with new URL

2. **Keep ngrok Running:**
   - ngrok must stay running for the tunnel to work
   - Closing ngrok closes the tunnel

3. **Free Tier Limits:**
   - 40 connections/minute
   - 2 hours session timeout
   - Random URL each time

4. **Flask Must Be Running:**
   - Make sure Flask API is running on port 5000
   - ngrok tunnels to `localhost:5000`

---

## 🎯 Quick Start Commands

**Terminal 1 - Flask API:**
```powershell
cd C:\Users\user\OneDrive\Desktop\febremed-ai-care\backend
python app.py
```

**Terminal 2 - ngrok:**
```powershell
"C:\Program Files\ngrok.exe" http 5000
# Copy the HTTPS URL from output
```

**Terminal 3 - Frontend:**
```powershell
cd C:\Users\user\OneDrive\Desktop\febremed-ai-care
npm run dev
```

---

## ✅ Verification

### Test 1: Flask API
```powershell
curl http://localhost:5000/api/health
```
Should return: `{"status":"healthy","fever_model_loaded":true}`

### Test 2: ngrok Tunnel
- Open your ngrok HTTPS URL in browser
- Add `/api/health` to the end
- Example: `https://abc123.ngrok.io/api/health`
- Should return: `{"status":"healthy","fever_model_loaded":true}`

### Test 3: Supabase Secret
- Dashboard → Settings → Edge Functions → Secrets
- `PYTHON_API_URL` should be set to your ngrok URL

---

## 🐛 Troubleshooting

### ngrok Won't Start

**Error:** "Port 5000 already in use"
- **Fix:** Make sure Flask is running on port 5000
- **Check:** `netstat -ano | findstr :5000`

**Error:** "Command not found"
- **Fix:** Use full path: `"C:\Program Files\ngrok.exe" http 5000`
- **Or:** Add ngrok to your PATH

### Can't Access via ngrok URL

**Problem:** Browser shows "Tunnel not found"
- **Fix:** Make sure ngrok is still running
- **Fix:** Check Flask is running on port 5000
- **Fix:** Verify ngrok URL is correct

---

## 🎬 Ready for Demo!

Once ngrok is running and you've set the Supabase secret:

1. ✅ Flask API running (Terminal 1)
2. ✅ ngrok tunnel active (Terminal 2)
3. ✅ Supabase secret set
4. ✅ Frontend running (Terminal 3)

**You're ready to demo!** 🚀

