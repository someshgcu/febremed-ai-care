# 🚀 Quick Deploy Guide - analyze-fever Function

## ✅ Fastest Method: Supabase Dashboard (2 minutes)

### Step 1: Deploy Function

1. **Open this link:**
   ```
   https://app.supabase.com/project/pechdovoklsfxssvawdx/functions
   ```

2. **If function exists:**
   - Click on `analyze-fever`
   - Click "Redeploy" or "Edit"
   - Replace code with content from `FUNCTION_CODE_TO_DEPLOY.ts`
   - Click "Deploy"

3. **If function doesn't exist:**
   - Click "Deploy a new function"
   - Name: `analyze-fever`
   - Copy entire content from `FUNCTION_CODE_TO_DEPLOY.ts`
   - Paste into the code editor
   - Click "Deploy"

### Step 2: Set GEMINI_API_KEY Secret

1. **Go to Secrets:**
   ```
   https://app.supabase.com/project/pechdovoklsfxssvawdx/settings/functions
   ```

2. **Click "Secrets" tab**

3. **Add Secret:**
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key (get from https://makersuite.google.com/app/apikey)
   - Click "Save"

4. **Wait 1-2 minutes** for secret to propagate

### Step 3: Test

```bash
node test-edge-function.js
```

Expected: ✅ 200 Success with AI analysis JSON

---

## 🔧 Alternative: Using MCP Server

If your MCP server supports function deployment:

1. **Open MCP tools** in your IDE/editor
2. **Look for deployment methods** like:
   - `deploy_function`
   - `create_function` 
   - `update_function`
3. **Deploy with:**
   - Project: `pechdovoklsfxssvawdx`
   - Function name: `analyze-fever`
   - Code: Content from `FUNCTION_CODE_TO_DEPLOY.ts`
4. **Set secret:**
   - Use `set_secret` method
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key

---

## 📋 Checklist

- [ ] Function deployed (visible in dashboard)
- [ ] GEMINI_API_KEY secret is set
- [ ] Test script returns 200 (not 401 or 500)
- [ ] Function logs show no errors

---

**That's it!** The function should now work. 🎉


