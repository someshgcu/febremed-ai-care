# FebreMed Setup Guide

Quick setup guide to get FebreMed running locally and deploy it.

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Gemini API Key (for Edge Functions)
GEMINI_API_KEY=your-gemini-api-key-here
```

**Get your Supabase credentials:**
1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings → API
4. Copy "Project URL" → `VITE_SUPABASE_URL`
5. Copy "anon public" key → `VITE_SUPABASE_ANON_KEY`

**Get your Gemini API key:**
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy it → `GEMINI_API_KEY`

### 3. Run Database Migrations

```bash
# If using Supabase CLI
supabase migration up

# Or apply migrations manually via Supabase Dashboard
# Go to: SQL Editor → Run migration files
```

### 4. Deploy Edge Function

```bash
# Set the secret in Supabase
supabase secrets set GEMINI_API_KEY=your-gemini-api-key-here

# Deploy the function
supabase functions deploy analyze-fever
```

### 5. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:8080

---

## 🔧 Optional: Prescription OCR Setup

If you want to use the prescription upload feature:

### 1. Install Tesseract OCR

**Windows:**
- Download from: https://github.com/UB-Mannheim/tesseract/wiki
- Install and note the path (e.g., `C:\Program Files\Tesseract-OCR`)

**macOS:**
```bash
brew install tesseract
```

**Linux:**
```bash
sudo apt-get install tesseract-ocr
```

### 2. Set Up Flask Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure Flask Environment

Add to `.env`:
```env
FLASK_ENV=development
FLASK_APP=app.py
GEMINI_API_KEY=your-gemini-api-key-here
TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe  # Windows only if not in PATH
```

### 4. Start Flask Server

```bash
cd backend
python app.py
```

The Flask server will run on http://127.0.0.1:5000 (Vite proxies `/api/*` to this)

---

## 📦 Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

---

## 🌐 Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `GEMINI_API_KEY` (if needed for client-side)

3. **Deploy:**
   - Vercel will auto-detect Vite
   - Build command: `npm run build`
   - Output directory: `dist`

---

## 🌐 Deploy to Netlify

1. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Environment variables:**
   - Add all `VITE_*` variables in Netlify dashboard
   - Go to: Site settings → Environment variables

3. **Deploy:**
   - Connect GitHub repository
   - Netlify will auto-deploy

---

## ✅ Verify Setup

1. **Check Supabase connection:**
   - Open browser console
   - Should see no errors about missing Supabase URL

2. **Test Edge Function:**
   - Complete an assessment
   - Check browser network tab for `/functions/v1/analyze-fever` call
   - Should return AI analysis (not error)

3. **Test Authentication:**
   - Go to `/auth`
   - Try signing up (check Supabase dashboard for new user)

4. **Test Assessment Flow:**
   - Go to `/assessment`
   - Fill out form and submit
   - Should redirect to `/results/:id`

---

## 🐛 Troubleshooting

### "Missing env.VITE_SUPABASE_URL"
- **Fix:** Create `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Edge Function Returns 500
- **Fix:** 
  1. Check `GEMINI_API_KEY` is set in Supabase secrets
  2. Verify function is deployed: `supabase functions list`
  3. Check logs: `supabase functions logs analyze-fever`

### Prescription OCR Not Working
- **Fix:**
  1. Ensure Flask backend is running on port 5000
  2. Check Tesseract is installed and in PATH
  3. Verify `GEMINI_API_KEY` is set in Flask environment

### Database Errors
- **Fix:**
  1. Run migrations: `supabase migration up`
  2. Check RLS policies allow access
  3. Verify table names match in code

---

## 📚 Additional Resources

- **Supabase Docs:** https://supabase.com/docs
- **Vite Docs:** https://vitejs.dev
- **React Router:** https://reactrouter.com
- **shadcn/ui:** https://ui.shadcn.com

---

**Need help?** Check `PROJECT_DIAGNOSTIC_REPORT.md` for detailed information.


