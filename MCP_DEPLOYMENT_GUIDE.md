# Using Supabase MCP Server to Deploy Edge Function

## Quick Start

Since you have the Supabase MCP server configured, here's how to deploy and manage your edge function:

## MCP Server Configuration

Your MCP server is configured at:
```
https://mcp.supabase.com/mcp?project_ref=pechdovoklsfxssvawdx
```

## Step-by-Step Deployment

### Step 1: Set the GEMINI_API_KEY Secret

First, you need to set the Gemini API key as a secret in Supabase. You can do this via:

**Option A: Supabase Dashboard**
1. Go to: https://app.supabase.com/project/pechdovoklsfxssvawdx/settings/functions
2. Click "Add Secret"
3. Name: `GEMINI_API_KEY`
4. Value: Your Gemini API key
5. Click "Save"

**Option B: Using MCP Server** (if available)
The MCP server should provide a method to set secrets. Check the MCP server documentation for the exact method name.

### Step 2: Deploy the Function

**Using Supabase Dashboard:**
1. Go to: https://app.supabase.com/project/pechdovoklsfxssvawdx/functions
2. Click "Deploy a new function"
3. Select "analyze-fever" from your local functions
4. Or use the CLI: `supabase functions deploy analyze-fever`

**Using MCP Server:**
If your MCP server supports function deployment, use the appropriate method to deploy `supabase/functions/analyze-fever/index.ts`

### Step 3: Verify Deployment

1. Check function exists:
   - Go to: https://app.supabase.com/project/pechdovoklsfxssvawdx/functions
   - You should see `analyze-fever` in the list

2. Test the function:
   - Use the test script: `node test-edge-function.js`
   - Or test from your frontend by completing an assessment

### Step 4: Check Logs

If there are errors, check the logs:
- Go to: https://app.supabase.com/project/pechdovoklsfxssvawdx/logs/edge-functions
- Filter by function name: `analyze-fever`

## Common Errors & Solutions

### Error: "GEMINI_API_KEY is not configured"

**Solution:**
1. Go to Supabase Dashboard → Settings → Functions
2. Add secret: `GEMINI_API_KEY` = your API key
3. Redeploy the function (or wait a few minutes for secret to propagate)

### Error: "Function not found" or 404

**Solution:**
1. Verify function is deployed
2. Check function name matches: `analyze-fever`
3. Ensure you're using the correct project reference

### Error: CORS errors

**Solution:**
The function already includes CORS headers. If you see CORS errors:
- Check the function is being called from an allowed origin
- Verify the `Access-Control-Allow-Origin` header in function code

### Error: Gemini API errors (429, 400, etc.)

**Solution:**
1. Check your Gemini API key is valid
2. Verify you have quota remaining
3. Check the API key has the correct permissions
4. Review Gemini API error message in function logs

## Testing the Function

### Method 1: Using Test Script

```bash
# Make sure you have your .env file set up
node test-edge-function.js
```

### Method 2: From Frontend

1. Start your dev server: `npm run dev`
2. Go to `/assessment`
3. Fill out the form and submit
4. Check browser console for errors
5. Check network tab for the function call

### Method 3: Using Supabase Dashboard

1. Go to: https://app.supabase.com/project/pechdovoklsfxssvawdx/functions
2. Click on `analyze-fever`
3. Use the "Invoke function" tab
4. Enter test payload:
```json
{
  "patientData": {
    "age": 35,
    "temperature": 38.5,
    "duration": 3,
    "medicationType": "Antipyretic",
    "medicationName": "Paracetamol",
    "location": "Mumbai",
    "daysOnMedication": 2,
    "compliance": 80,
    "symptoms": ["Headache", "Body ache"],
    "comorbidities": []
  }
}
```

## Function Code Location

The edge function code is at:
```
supabase/functions/analyze-fever/index.ts
```

## Environment Variables

The function needs these secrets (set in Supabase, not .env):
- `GEMINI_API_KEY` (required) - Your Gemini API key
- `GEMINI_MODEL` (optional) - Defaults to `models/gemini-flash-latest`

## Verification Checklist

- [ ] GEMINI_API_KEY secret is set in Supabase
- [ ] Function is deployed (visible in Supabase dashboard)
- [ ] Function logs show no errors
- [ ] Test script runs successfully
- [ ] Frontend can call the function
- [ ] Function returns valid JSON response

## Next Steps After Deployment

1. Test the function with the test script
2. Complete an assessment in your app
3. Check the results page loads correctly
4. Verify AI analysis is displayed
5. Check function logs for any warnings

---

**Project Reference:** `pechdovoklsfxssvawdx`  
**Function Name:** `analyze-fever`  
**Function Path:** `supabase/functions/analyze-fever/index.ts`

