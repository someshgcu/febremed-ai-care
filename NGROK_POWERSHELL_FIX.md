# ngrok PowerShell Command - Fixed!

## ❌ The Problem

PowerShell doesn't like the syntax `"C:\Program Files\ngrok.exe" http 5000`

## ✅ The Solution

In PowerShell, use the **call operator** `&` before the path:

```powershell
& "C:\Program Files\ngrok.exe" http 5000
```

---

## 🚀 Correct Commands

### Option 1: Using Call Operator (Recommended)

```powershell
& "C:\Program Files\ngrok.exe" http 5000
```

### Option 2: Using PowerShell Script

```powershell
.\START_NGROK.ps1
```

### Option 3: Using Batch File

```powershell
.\START_NGROK.bat
```

Or just **double-click** `START_NGROK.bat`

---

## 📋 Step-by-Step

1. **Open PowerShell**
2. **Navigate to project:**
   ```powershell
   cd C:\Users\user\OneDrive\Desktop\febremed-ai-care
   ```

3. **Start ngrok:**
   ```powershell
   & "C:\Program Files\ngrok.exe" http 5000
   ```

4. **You'll see:**
   ```
   Forwarding    https://abc123xyz.ngrok.io -> http://localhost:5000
   ```

5. **Copy the HTTPS URL** (the part before `->`)

6. **Set in Supabase:**
   - Dashboard → Settings → Edge Functions → Secrets
   - Add `PYTHON_API_URL` = your ngrok URL

---

## ✅ Quick Test

After starting ngrok, test it:

1. **Copy the HTTPS URL** from ngrok output
2. **Open in browser:** `https://your-url.ngrok.io/api/health`
3. **Should return:** `{"status":"healthy","fever_model_loaded":true}`

---

**That's it!** Use `&` before the path in PowerShell. 🚀

