# Deploy Edge Function - Quick Steps

## ✅ YES - You Must Deploy!

The edge function was updated to call your Python API. Deploy it now.

---

## 🚀 Quick Deployment (2 Steps)

### Step 1: Deploy the Function

**Option A: Using Supabase Dashboard (Easiest)**

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **Edge Functions** in sidebar
4. Click on `analyze-fever`
5. Click **Deploy** button

**Option B: Using CLI**

```powershell
# Make sure you're in project root
cd C:\Users\user\OneDrive\Desktop\febremed-ai-care

# Deploy function
supabase functions deploy analyze-fever
```

---

### Step 2: Set the Secret

**In Supabase Dashboard:**

1. Go to: **Project Settings** → **Edge Functions** → **Secrets**
2. Click **Add Secret** (or edit if exists)
3. **Name:** `PYTHON_API_URL`
4. **Value:** 
   - **For local demo:** Your ngrok URL (e.g., `https://abc123.ngrok.io`)
   - **For production:** Your deployed API URL
5. Click **Save**

**Or using CLI:**

```powershell
supabase secrets set PYTHON_API_URL=https://your-ngrok-url.ngrok.io
```

---

## ⚠️ Important for Local Demo

**Before setting the secret:**

1. **Start ngrok first:**
   ```powershell
   ngrok http 5000
   ```

2. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

3. **Set that URL** in Supabase secret `PYTHON_API_URL`

4. **Note:** If you restart ngrok, you'll get a new URL - update the secret!

---

## ✅ Verify Deployment

1. **Check function status:**
   - Dashboard → Edge Functions
   - `analyze-fever` should show as "Active"

2. **Check secret:**
   - Dashboard → Settings → Edge Functions → Secrets
   - `PYTHON_API_URL` should be listed

3. **Test:**
   - Submit assessment from frontend
   - Check Edge Functions → Logs
   - Should see successful API calls

---

## 🎯 Summary

**For Local Demo:**
1. ✅ Deploy edge function
2. ✅ Set `PYTHON_API_URL` = your ngrok HTTPS URL
3. ✅ Make sure Flask is running
4. ✅ Make sure ngrok is running

**That's it!** Your edge function will now call your Python API. 🚀

