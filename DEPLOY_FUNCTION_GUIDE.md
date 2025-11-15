# Deploy Edge Function - Step by Step Guide

## 🎯 Quick Deployment (Recommended)

### Method 1: Supabase Dashboard (Easiest - 2 minutes)

1. **Open Supabase Dashboard:**
   ```
   https://app.supabase.com/project/pechdovoklsfxssvawdx/functions
   ```

2. **Deploy the Function:**
   - If `analyze-fever` exists: Click it → "Redeploy" button
   - If it doesn't exist: Click "Deploy a new function" → Upload `supabase/functions/analyze-fever/index.ts`

3. **Set the Secret:**
   - Go to: Settings → Functions → Secrets
   - Click "Add Secret"
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key
   - Save

4. **Test:**
   ```bash
   node test-edge-function.js
   ```

### Method 2: Using MCP Server

Since you have MCP connected at:
```
https://mcp.supabase.com/mcp?project_ref=pechdovoklsfxssvawdx
```

You can use the MCP server to deploy. The exact method depends on your MCP server implementation, but typically:

1. **Check available MCP methods** in your IDE/editor
2. **Look for functions like:**
   - `deploy_function`
   - `create_function`
   - `update_function`
   - `set_secret`

3. **Deploy using MCP:**
   - Function name: `analyze-fever`
   - Function code: Content of `supabase/functions/analyze-fever/index.ts`
   - Secrets: `GEMINI_API_KEY` = your key

### Method 3: Install Supabase CLI

**For Windows:**

**Option A: Using Scoop (Recommended)**
```powershell
# Install Scoop if you don't have it
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Install Supabase CLI
scoop install supabase
```

**Option B: Using Chocolatey**
```powershell
choco install supabase
```

**Option C: Direct Download**
1. Go to: https://github.com/supabase/cli/releases
2. Download the Windows executable
3. Add to PATH

**Then deploy:**
```bash
supabase login
supabase link --project-ref pechdovoklsfxssvawdx
supabase functions deploy analyze-fever
supabase secrets set GEMINI_API_KEY=your-gemini-api-key
```

## 📋 Pre-Deployment Checklist

- [ ] Function code is ready: `supabase/functions/analyze-fever/index.ts`
- [ ] You have a Gemini API key
- [ ] You have access to Supabase project

## 🔧 Post-Deployment Steps

1. **Set GEMINI_API_KEY Secret:**
   - Dashboard → Settings → Functions → Secrets
   - Add: `GEMINI_API_KEY` = your key

2. **Verify Deployment:**
   - Check function appears in: https://app.supabase.com/project/pechdovoklsfxssvawdx/functions
   - Test with: `node test-edge-function.js`

3. **Check Logs:**
   - Dashboard → Logs → Edge Functions
   - Filter by: `analyze-fever`

## 🐛 Troubleshooting

### Function not deploying
- Check you have project access
- Verify function code has no syntax errors
- Check Supabase project is active

### Secret not working
- Wait 1-2 minutes after setting secret
- Verify secret name is exactly: `GEMINI_API_KEY`
- Check secret is set in correct project

### Function returns errors
- Check function logs in dashboard
- Verify GEMINI_API_KEY is valid
- Check Gemini API has quota

## ✅ Success Indicators

- Function appears in dashboard
- Test script returns 200 (not 401 or 500)
- Function logs show successful execution
- Assessment form works in your app

---

**Recommended:** Use Method 1 (Dashboard) - it's the fastest and most reliable!

