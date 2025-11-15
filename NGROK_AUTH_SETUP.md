# ngrok Authentication Setup

## ❌ Error: ngrok Not Authenticated

ngrok requires an account and authtoken to work.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Sign Up for ngrok Account

1. **Go to:** https://dashboard.ngrok.com/signup
2. **Sign up** (free account is fine)
3. **Verify your email** if needed

---

### Step 2: Get Your Authtoken

1. **Go to:** https://dashboard.ngrok.com/get-started/your-authtoken
2. **Copy your authtoken** (it looks like: `2abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`)

---

### Step 3: Install Authtoken

**In PowerShell, run:**

```powershell
& "C:\Program Files\ngrok.exe" config add-authtoken YOUR_AUTHTOKEN_HERE
```

**Replace `YOUR_AUTHTOKEN_HERE` with your actual authtoken from Step 2.**

**Example:**
```powershell
& "C:\Program Files\ngrok.exe" config add-authtoken 2abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

---

### Step 4: Verify Setup

```powershell
& "C:\Program Files\ngrok.exe" version
```

Should show your account info.

---

### Step 5: Start ngrok

```powershell
& "C:\Program Files\ngrok.exe" http 5000
```

Should now work without errors!

---

## 📋 Quick Reference

1. **Sign up:** https://dashboard.ngrok.com/signup
2. **Get token:** https://dashboard.ngrok.com/get-started/your-authtoken
3. **Install:** `& "C:\Program Files\ngrok.exe" config add-authtoken YOUR_TOKEN`
4. **Start:** `& "C:\Program Files\ngrok.exe" http 5000`

---

## ✅ After Authentication

Once authenticated, you'll see:

```
Session Status                online
Account                       Your Name (Plan: Free)
Forwarding                    https://abc123.ngrok.io -> http://localhost:5000
```

**Copy the HTTPS URL** and set it in Supabase!

---

**Follow these steps and ngrok will work!** 🚀

