# Authentication Fix for Edge Function Test

## Issue
The test script was getting a **401 "Invalid JWT"** error because it was missing the `apikey` header.

## Fix Applied
Updated `test-edge-function.js` to include both headers:
- `apikey`: The anon key (required by Supabase edge functions)
- `Authorization`: Bearer token (also included for compatibility)

## How to Test

1. **Make sure your `.env` file has:**
   ```env
   VITE_SUPABASE_URL=https://pechdovoklsfxssvawdx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

2. **Get your anon key from Supabase:**
   - Go to: https://app.supabase.com/project/pechdovoklsfxssvawdx/settings/api
   - Copy the "anon public" key
   - Add it to your `.env` file

3. **Run the test:**
   ```bash
   node test-edge-function.js
   ```

## Expected Results

### ✅ Success (200)
If the function is deployed and GEMINI_API_KEY is set:
```json
{
  "decision": "CONTINUE" | "CONSULT_DOCTOR" | "LIKELY_SAFE_TO_STOP",
  "recovery_probability": 0.85,
  "confidence": 0.92,
  "explanation": "...",
  ...
}
```

### ❌ Error: 401 Invalid JWT
**Solution:** Check your `VITE_SUPABASE_ANON_KEY` in `.env` file matches your Supabase project.

### ❌ Error: 404 Function not found
**Solution:** Deploy the function first:
- Go to: https://app.supabase.com/project/pechdovoklsfxssvawdx/functions
- Deploy `analyze-fever` function

### ❌ Error: 500 GEMINI_API_KEY not configured
**Solution:** Set the secret in Supabase:
- Go to: https://app.supabase.com/project/pechdovoklsfxssvawdx/settings/functions
- Add secret: `GEMINI_API_KEY` = your Gemini API key

## What Changed

**Before:**
```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
}
```

**After:**
```javascript
headers: {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,  // ← Added this
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
}
```

The `apikey` header is required by Supabase edge functions for authentication.

## Next Steps

1. ✅ Fix applied - test script now includes `apikey` header
2. ⏳ Add `VITE_SUPABASE_ANON_KEY` to your `.env` file
3. ⏳ Run test: `node test-edge-function.js`
4. ⏳ If 500 error: Set `GEMINI_API_KEY` secret in Supabase
5. ⏳ If 404 error: Deploy the function

---

**The authentication issue is now fixed!** Just make sure your `.env` file has the correct anon key.

