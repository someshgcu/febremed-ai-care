# Edge Function Setup & Troubleshooting Guide

## Project Configuration

Your Supabase project reference: `pechdovoklsfxssvawdx`

## Using Supabase MCP Server

Since you have the Supabase MCP server configured, you can use it to manage your edge functions. Here's how:

### 1. Check Edge Function Status

Using the MCP server, you can check if the function is deployed:

```json
{
  "method": "supabase/list_functions",
  "params": {
    "project_ref": "pechdovoklsfxssvawdx"
  }
}
```

### 2. Deploy the Edge Function

To deploy the `analyze-fever` function:

```json
{
  "method": "supabase/deploy_function",
  "params": {
    "project_ref": "pechdovoklsfxssvawdx",
    "function_name": "analyze-fever",
    "function_path": "supabase/functions/analyze-fever"
  }
}
```

### 3. Set Environment Secrets

The edge function needs the `GEMINI_API_KEY` secret. Set it via MCP:

```json
{
  "method": "supabase/set_secret",
  "params": {
    "project_ref": "pechdovoklsfxssvawdx",
    "name": "GEMINI_API_KEY",
    "value": "your-gemini-api-key-here"
  }
}
```

### 4. Check Function Logs

To see what errors are occurring:

```json
{
  "method": "supabase/get_function_logs",
  "params": {
    "project_ref": "pechdovoklsfxssvawdx",
    "function_name": "analyze-fever"
  }
}
```

### 5. Test the Function

Test the function with sample data:

```json
{
  "method": "supabase/invoke_function",
  "params": {
    "project_ref": "pechdovoklsfxssvawdx",
    "function_name": "analyze-fever",
    "body": {
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
  }
}
```

## Common Issues & Solutions

### Issue 1: "GEMINI_API_KEY is not configured"

**Solution:**
1. Make sure you've set the secret in Supabase:
   - Go to: https://app.supabase.com/project/pechdovoklsfxssvawdx/settings/functions
   - Add secret: `GEMINI_API_KEY` with your Gemini API key value

2. Or use MCP to set it (see above)

### Issue 2: Function returns 500 error

**Check:**
1. Function logs for specific error messages
2. Gemini API key is valid and has quota
3. Function is properly deployed

### Issue 3: CORS errors

**Solution:**
The function already includes CORS headers. If you still see CORS errors:
- Check that the function is being called from the correct origin
- Verify the `Access-Control-Allow-Origin` header is set to `*` (or your domain)

### Issue 4: "Function not found"

**Solution:**
1. Deploy the function first
2. Verify the function name matches: `analyze-fever`
3. Check the function exists in your project

## Manual Deployment (Alternative)

If MCP server is not working, you can use Supabase CLI:

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref pechdovoklsfxssvawdx

# Set the secret
supabase secrets set GEMINI_API_KEY=your-gemini-api-key-here

# Deploy the function
supabase functions deploy analyze-fever
```

## Verify Function is Working

1. **Check function is deployed:**
   - Go to: https://app.supabase.com/project/pechdovoklsfxssvawdx/functions
   - You should see `analyze-fever` in the list

2. **Test from frontend:**
   - Complete an assessment in your app
   - Check browser console for errors
   - Check network tab for the function call

3. **Check logs:**
   - Go to: https://app.supabase.com/project/pechdovoklsfxssvawdx/logs/edge-functions
   - Look for `analyze-fever` logs

## Function Code Location

The edge function code is located at:
```
supabase/functions/analyze-fever/index.ts
```

## Environment Variables Needed

The function requires:
- `GEMINI_API_KEY` - Your Google Gemini API key
- `GEMINI_MODEL` (optional) - Defaults to `models/gemini-flash-latest`

Both should be set as **secrets** in Supabase, not as regular environment variables.

## Next Steps

1. Set `GEMINI_API_KEY` secret in Supabase
2. Deploy the function using MCP or CLI
3. Test the function with sample data
4. Check logs if there are any errors
5. Verify the function works from your frontend

---

**Need help?** Check the function logs in Supabase dashboard for specific error messages.

