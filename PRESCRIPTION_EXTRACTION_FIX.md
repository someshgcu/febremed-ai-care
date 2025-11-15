# Prescription Extraction Error - Diagnosis & Fix

## Common Issues & Solutions

### Issue 1: Flask Server Not Running ❌

**Symptoms:**
- Error: "Failed to fetch" or "Network error"
- Browser console shows connection refused

**Solution:**
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Activate virtual environment:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Or if using PowerShell
   .\venv\Scripts\Activate.ps1
   ```

3. Start Flask server:
   ```bash
   python app.py
   ```

4. Verify it's running:
   - Should see: "Running on http://127.0.0.1:5000"
   - Test: `http://127.0.0.1:5000/api/health`

### Issue 2: GEMINI_API_KEY Not Set ❌

**Symptoms:**
- Error: "GEMINI_API_KEY is not configured"
- Response status: 500

**Solution:**
1. Add to `.env` file in project root:
   ```env
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

2. Get API key from: https://makersuite.google.com/app/apikey

3. Restart Flask server after adding the key

### Issue 3: Tesseract OCR Not Installed ❌

**Symptoms:**
- Error: "Tesseract OCR is not installed or not found in PATH"
- Response status: 500

**Solution:**

**Windows:**
1. Download Tesseract from: https://github.com/UB-Mannheim/tesseract/wiki
2. Install it (default location: `C:\Program Files\Tesseract-OCR`)
3. If installed elsewhere, add to `.env`:
   ```env
   TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe
   ```

**macOS:**
```bash
brew install tesseract
```

**Linux:**
```bash
sudo apt-get install tesseract-ocr
```

### Issue 4: Dependencies Not Installed ❌

**Symptoms:**
- Import errors when starting Flask
- ModuleNotFoundError

**Solution:**
```bash
cd backend
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### Issue 5: CORS Issues ❌

**Symptoms:**
- CORS error in browser console
- Request blocked

**Solution:**
- The Flask app already has CORS enabled
- Make sure Vite proxy is configured correctly in `vite.config.ts`
- Check that requests go to `/api/extract-medication` (not directly to Flask)

### Issue 6: Image Quality Issues ⚠️

**Symptoms:**
- Error: "Could not extract text from image"
- Empty OCR results

**Solution:**
- Use clear, well-lit prescription photos
- Ensure text is readable
- Try different image formats (JPG, PNG)

## Quick Diagnostic Steps

1. **Test Flask server:**
   ```bash
   node test-prescription-api.js
   ```

2. **Check Flask logs:**
   - Look at the terminal where Flask is running
   - Check for error messages

3. **Check browser console:**
   - Open DevTools (F12)
   - Check Network tab for `/api/extract-medication` request
   - Look at response status and error message

4. **Verify environment:**
   ```bash
   # Check if .env file exists and has GEMINI_API_KEY
   # Check if Flask server is running
   # Check if Tesseract is installed
   ```

## Complete Setup Checklist

- [ ] Python virtual environment created and activated
- [ ] Dependencies installed: `pip install -r requirements.txt`
- [ ] `.env` file has `GEMINI_API_KEY`
- [ ] Tesseract OCR is installed
- [ ] `TESSERACT_CMD` set in `.env` if Tesseract not in PATH
- [ ] Flask server is running: `python app.py`
- [ ] Flask server accessible at `http://127.0.0.1:5000`
- [ ] Vite dev server is running: `npm run dev`
- [ ] Vite proxy configured in `vite.config.ts`

## Testing the Fix

1. **Start Flask server:**
   ```bash
   cd backend
   venv\Scripts\activate
   python app.py
   ```

2. **In another terminal, test:**
   ```bash
   node test-prescription-api.js
   ```

3. **Test in browser:**
   - Go to `/assessment` page
   - Upload a prescription image
   - Click "Extract Medication"
   - Check for errors in console

## Expected Behavior

When working correctly:
1. User uploads prescription image
2. Frontend sends to `/api/extract-medication`
3. Vite proxies to Flask at `http://127.0.0.1:5000`
4. Flask extracts text with Tesseract
5. Flask sends text to Gemini for analysis
6. Flask returns medication data
7. Frontend displays extracted information

---

**Most Common Issue:** Flask server not running. Make sure to start it with `python app.py` in the backend directory!


