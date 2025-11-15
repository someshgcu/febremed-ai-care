# Supabase Authentication & Deployment

## 🔑 Your Auth Token

You have your Supabase auth token. Let's use it to deploy the edge function.

---

## 🚀 Quick Setup Steps

### Step 1: Authenticate with Supabase CLI

```powershell
supabase login --token 35VXle7MTpNAjLqqIbF1a6YDQjl_3BNGu1hcHGF6buYXPVs8w
```

### Step 2: Link to Your Project

You'll need your project reference ID. Find it in:
- Supabase Dashboard → Settings → General → Reference ID

Then link:
```powershell
supabase link --project-ref YOUR_PROJECT_REF
```

### Step 3: Deploy Edge Function

```powershell
supabase functions deploy analyze-fever
```

### Step 4: Set Environment Secret

After you get your ngrok URL, set it:
```powershell
supabase secrets set PYTHON_API_URL=https://your-ngrok-url.ngrok.io
```

---

## 📋 Alternative: Using Dashboard

If CLI doesn't work, use the Dashboard:

1. **Deploy Function:**
   - Go to: https://supabase.com/dashboard
   - Edge Functions → `analyze-fever` → Deploy

2. **Set Secret:**
   - Project Settings → Edge Functions → Secrets
   - Add: `PYTHON_API_URL` = your ngrok URL

---

## ✅ Verify Setup

1. **Check authentication:**
   ```powershell
   supabase projects list
   ```

2. **Check function:**
   - Dashboard → Edge Functions → Should show `analyze-fever` as deployed

3. **Check secret:**
   - Dashboard → Settings → Edge Functions → Secrets
   - `PYTHON_API_URL` should be listed

---

**Ready to deploy!** Follow the steps above. 🚀

