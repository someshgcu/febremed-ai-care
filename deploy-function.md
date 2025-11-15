# Deploy Edge Function - Quick Guide

## Option 1: Using Supabase Dashboard (Easiest)

1. **Go to Supabase Dashboard:**
   - https://app.supabase.com/project/pechdovoklsfxssvawdx/functions

2. **If function exists:**
   - Click on `analyze-fever`
   - Click "Redeploy" or delete and create new

3. **If function doesn't exist:**
   - Click "Deploy a new function"
   - Name: `analyze-fever`
   - Upload or paste the code from: `supabase/functions/analyze-fever/index.ts`

4. **Set the secret:**
   - Go to: Settings → Functions → Secrets
   - Add: `GEMINI_API_KEY` = your Gemini API key
   - Save

## Option 2: Using MCP Server (If Available)

Since you have MCP connected, you can use it to deploy. The MCP server should provide methods like:
- `deploy_function` or `create_function`
- `set_secret`

Check your MCP server documentation for the exact method names.

## Option 3: Install Supabase CLI Properly

For Windows, install via:
- **Scoop:** `scoop install supabase`
- **Chocolatey:** `choco install supabase`
- **Direct download:** https://github.com/supabase/cli/releases

Then:
```bash
supabase login
supabase link --project-ref pechdovoklsfxssvawdx
supabase functions deploy analyze-fever
```

## Option 4: Manual Deployment via API

I can create a script that uses the Supabase Management API to deploy the function.

