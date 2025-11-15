# Deploy Supabase Edge Function - Quick Guide

## ✅ Yes, You Need to Deploy!

The edge function was updated to call your Python Flask API instead of Gemini. You must deploy it for the changes to take effect.

---

## 🚀 Deployment Options

### Option 1: Using Supabase CLI (Recommended)

**Prerequisites:**
- Supabase CLI installed
- Logged in to Supabase

**Steps:**

1. **Login to Supabase (if not already):**
   ```powershell
   supabase login
   ```

2. **Link to your project:**
   ```powershell
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   (Find your project ref in Supabase Dashboard → Settings → General)

3. **Deploy the edge function:**
   ```powershell
   supabase functions deploy analyze-fever
   ```

4. **Set the environment secret:**
   ```powershell
   supabase secrets set PYTHON_API_URL=https://your-ngrok-url.ngrok.io
   ```
   (Use your ngrok HTTPS URL for local demo, or production URL later)

---

### Option 2: Using Supabase Dashboard

**Steps:**

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Edge Functions:**
   - Click **Edge Functions** in left sidebar
   - Find `analyze-fever` function

3. **Deploy Function:**
   - Click on `analyze-fever`
   - Click **Deploy** button
   - Or use **Deploy via CLI** and copy the command

4. **Set Environment Secret:**
   - Go to **Project Settings** → **Edge Functions** → **Secrets**
   - Click **Add Secret** (or edit existing)
   - **Name:** `PYTHON_API_URL`
   - **Value:** 
     - For local demo: Your ngrok URL (e.g., `https://abc123.ngrok.io`)
     - For production: Your deployed API URL
   - Click **Save**

---

## 🔍 Verify Deployment

### Check 1: Function is Deployed
- Go to Supabase Dashboard → Edge Functions
- `analyze-fever` should show as "Active" or "Deployed"

### Check 2: Secret is Set
- Go to Project Settings → Edge Functions → Secrets
- `PYTHON_API_URL` should be listed

### Check 3: Test the Function
- Go to Edge Functions → `analyze-fever` → Logs
- Submit a test assessment from frontend
- Check logs for successful API calls

---

## 📝 Important Notes

### For Local Demo:
1. **Use ngrok URL** in `PYTHON_API_URL` secret
2. **ngrok URL changes** when you restart ngrok
3. **Update secret** if you restart ngrok with new URL

### For Production:
1. **Deploy Flask API** to Render/Railway first
2. **Use production URL** in `PYTHON_API_URL` secret
3. **No need for ngrok** in production

---

## 🎯 Quick Deployment Commands

```powershell
# 1. Login (if needed)
supabase login

# 2. Link project (if needed)
supabase link --project-ref YOUR_PROJECT_REF

# 3. Deploy function
supabase functions deploy analyze-fever

# 4. Set secret (for local demo with ngrok)
supabase secrets set PYTHON_API_URL=https://your-ngrok-url.ngrok.io
```

---

## ✅ Deployment Checklist

Before testing:

- [ ] Edge function deployed successfully
- [ ] `PYTHON_API_URL` secret is set
- [ ] Secret value is correct (ngrok URL for local, production URL for production)
- [ ] Flask API is running (for local demo)
- [ ] ngrok tunnel is active (for local demo)
- [ ] Can access Flask API via ngrok URL in browser

---

## 🐛 Troubleshooting

### Deployment Fails

**Error:** "Function not found"
- **Fix:** Make sure you're in the project root directory
- **Fix:** Check function exists at `supabase/functions/analyze-fever/index.ts`

**Error:** "Not authenticated"
- **Fix:** Run `supabase login` first

**Error:** "Project not linked"
- **Fix:** Run `supabase link --project-ref YOUR_PROJECT_REF`

---

### Function Deployed But Not Working

**Check logs:**
- Supabase Dashboard → Edge Functions → Logs
- Look for error messages

**Common issues:**
1. **Secret not set:** Set `PYTHON_API_URL` secret
2. **Wrong URL:** Verify ngrok URL is correct and accessible
3. **Flask not running:** Make sure Flask API is running on port 5000
4. **ngrok expired:** Restart ngrok and update secret

---

## 🎬 After Deployment

Once deployed:

1. **Test from frontend:**
   - Submit an assessment
   - Check if prediction is received

2. **Monitor logs:**
   - Watch Supabase edge function logs
   - Should see successful API calls

3. **Verify results:**
   - Results page should show prediction
   - Confidence scores should display

---

**Ready to deploy?** Follow the steps above! 🚀

