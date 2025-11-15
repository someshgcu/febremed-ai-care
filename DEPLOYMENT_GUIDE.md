# Complete Deployment Guide - Fever Prediction Integration

## 🎯 Overview

This guide walks you through deploying the complete fever prediction system:
1. Train XGBoost model
2. Deploy Flask API
3. Configure Supabase edge function
4. Test end-to-end integration

---

## 📋 Prerequisites

- Python 3.9+ installed
- pip package manager
- Supabase account and project
- (Optional) ngrok for local testing
- (Optional) Render/Railway account for production deployment

---

## 🚀 Step-by-Step Deployment

### STEP 1: Train the Model

```bash
cd backend
pip install -r requirements.txt
python train_fever_model.py
```

**Expected Output:**
```
MODEL ACCURACY: 0.XXXX (XX.XX%)
✅ EXCELLENT: Model accuracy >= 90%
```

**Verify:**
- Check that `backend/models/` contains:
  - `fever_model.pkl`
  - `label_encoder.pkl`
  - `feature_names.json`

---

### STEP 2: Start Flask API Locally

```bash
cd backend
python app.py
```

**Verify:**
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "fever_model_loaded": true
}
```

---

### STEP 3: Test Predictions

```bash
cd backend
python test_predictions.py
```

**Expected Output:**
```
✅ SUCCESS: Prediction matches expected result!
✅ SUCCESS: Prediction matches expected result!
✅ SUCCESS: Prediction matches expected result!

Total: 3/3 scenarios passed
🎉 ALL TESTS PASSED!
```

---

### STEP 4: Deploy Flask API (Choose One)

#### Option A: ngrok (Local Development)

1. **Install ngrok:**
   ```bash
   # Download from https://ngrok.com/download
   # Or: npm install -g ngrok
   ```

2. **Start ngrok tunnel:**
   ```bash
   ngrok http 5000
   ```

3. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

4. **Keep Flask server running** in another terminal

#### Option B: Render.com

1. **Create account** at https://render.com
2. **New Web Service** → Connect GitHub
3. **Configure:**
   - **Name:** `fever-prediction-api`
   - **Environment:** `Python 3`
   - **Build Command:** `cd backend && pip install -r requirements.txt && python train_fever_model.py`
   - **Start Command:** `cd backend && python app.py`
   - **Environment Variables:**
     - `PORT=5000`
     - `FLASK_ENV=production`

4. **Deploy** and wait for build to complete
5. **Copy your Render URL** (e.g., `https://fever-api.onrender.com`)

#### Option C: Railway

1. **Create account** at https://railway.app
2. **New Project** → Deploy from GitHub
3. **Configure:**
   - **Root Directory:** `backend`
   - **Start Command:** `python app.py`
   - **Build Command:** `pip install -r requirements.txt && python train_fever_model.py`

4. **Deploy** and copy your Railway URL

---

### STEP 5: Configure Supabase Edge Function

1. **Set Environment Secret:**
   - Go to Supabase Dashboard
   - Project Settings → Edge Functions → Secrets
   - Add secret:
     - **Name:** `PYTHON_API_URL`
     - **Value:** Your deployed API URL
       - ngrok: `https://abc123.ngrok.io`
       - Render: `https://your-api.onrender.com`
       - Railway: `https://your-app.railway.app`

2. **Deploy Edge Function:**
   ```bash
   supabase functions deploy analyze-fever
   ```

   Or use Supabase Dashboard:
   - Go to Edge Functions
   - Select `analyze-fever`
   - Click "Deploy"

---

### STEP 6: Test End-to-End Integration

#### Test 1: Direct API Test

```bash
curl -X POST http://localhost:5000/api/predict-fever \
  -H "Content-Type: application/json" \
  -d '{
    "Temperature": 39.2,
    "Age": 28,
    "BMI": 24.5,
    "Fever_Duration": 3,
    "Compliance_Rate": 85,
    "Headache": 1,
    "Body_Ache": 1,
    "Fatigue": 1,
    "Chronic_Conditions": 0
  }'
```

**Expected:** JSON response with `decision: "CONTINUE"`

#### Test 2: Supabase Edge Function Test

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/analyze-fever \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "patientData": {
      "temperature": 39.2,
      "age": 28,
      "duration": 3,
      "compliance": 85,
      "symptoms": ["Headache", "Body ache", "Fatigue"],
      "comorbidities": []
    }
  }'
```

**Expected:** JSON response with prediction

#### Test 3: Frontend Integration

1. **Start frontend:**
   ```bash
   npm run dev
   ```

2. **Navigate to Assessment page**
3. **Fill in form:**
   - Temperature: 39.2
   - Age: 28
   - Duration: 3 days
   - Compliance: 85%
   - Symptoms: Headache, Body ache, Fatigue

4. **Submit and verify:**
   - Check browser console for API calls
   - Verify prediction is displayed
   - Check that decision matches expected

---

## ✅ Validation Checklist

### Model Training
- [ ] Model accuracy ≥85% (preferably ≥90%)
- [ ] All 3 test scenarios pass in training script
- [ ] Model files created in `backend/models/`

### Flask API
- [ ] API starts without errors
- [ ] Health endpoint returns `fever_model_loaded: true`
- [ ] Prediction endpoint returns valid JSON
- [ ] All 3 test scenarios pass with `test_predictions.py`

### Supabase Integration
- [ ] Edge function deployed successfully
- [ ] `PYTHON_API_URL` secret is set
- [ ] Edge function can reach Python API
- [ ] Edge function returns valid predictions

### Frontend Integration
- [ ] Assessment form submits successfully
- [ ] Prediction is received and displayed
- [ ] No console errors
- [ ] Results page shows correct decision

---

## 🐛 Troubleshooting

### Issue: Model Not Loading

**Symptoms:**
- API returns `fever_model_loaded: false`
- Prediction endpoint returns 503 error

**Solutions:**
1. Verify model files exist: `ls backend/models/`
2. Re-train model: `python train_fever_model.py`
3. Check file permissions
4. Verify model directory path in `app.py`

---

### Issue: Supabase Can't Reach API

**Symptoms:**
- Edge function returns connection error
- Timeout errors

**Solutions:**
1. **For local development:**
   - Use ngrok (not `localhost`)
   - Verify ngrok tunnel is active
   - Update `PYTHON_API_URL` to ngrok URL

2. **For production:**
   - Verify API is publicly accessible
   - Check firewall/security settings
   - Test API URL directly in browser
   - Verify HTTPS is enabled

3. **Check Supabase logs:**
   ```bash
   supabase functions logs analyze-fever
   ```

---

### Issue: Low Model Accuracy

**Symptoms:**
- Accuracy < 85%
- Incorrect predictions

**Solutions:**
1. Increase training samples in `train_fever_model.py`:
   ```python
   X, y = generate_synthetic_data(n_samples=10000)  # Increase from 5000
   ```

2. Tune hyperparameters:
   - Adjust `max_depth`, `learning_rate`, `n_estimators`
   - Use grid search or random search

3. Review data generation logic
4. Add more features if available

---

### Issue: CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- API calls fail from frontend

**Solutions:**
1. Verify CORS is enabled in `app.py`:
   ```python
   CORS(app)  # Should be present
   ```

2. For production, configure CORS properly:
   ```python
   CORS(app, origins=["https://your-frontend.com"])
   ```

---

## 📊 Testing Scenarios

### Scenario 1: Should CONTINUE
```json
{
  "Temperature": 39.2,
  "Age": 28,
  "BMI": 24.5,
  "Fever_Duration": 3,
  "Compliance_Rate": 85,
  "Headache": 1,
  "Body_Ache": 1,
  "Fatigue": 1,
  "Chronic_Conditions": 0
}
```
**Expected:** `CONTINUE`

### Scenario 2: Should CONSULT_DOCTOR
```json
{
  "Temperature": 38.0,
  "Age": 35,
  "BMI": 26.0,
  "Fever_Duration": 4,
  "Compliance_Rate": 60,
  "Headache": 1,
  "Body_Ache": 0,
  "Fatigue": 0,
  "Chronic_Conditions": 0
}
```
**Expected:** `CONSULT_DOCTOR`

### Scenario 3: Should LIKELY_SAFE_TO_STOP
```json
{
  "Temperature": 37.1,
  "Age": 25,
  "BMI": 22.0,
  "Fever_Duration": 7,
  "Compliance_Rate": 95,
  "Headache": 0,
  "Body_Ache": 0,
  "Fatigue": 0,
  "Chronic_Conditions": 0
}
```
**Expected:** `LIKELY_SAFE_TO_STOP`

---

## 🎉 Success Criteria

Your integration is complete when:

1. ✅ **Model trained** with ≥85% accuracy
2. ✅ **Flask API** running and serving predictions
3. ✅ **Supabase function** successfully calls Python API
4. ✅ **Frontend** receives and displays predictions
5. ✅ **All 3 scenarios** pass validation
6. ✅ **No errors** in console/logs

**Print success message:** 🎉 **INTEGRATION COMPLETE - ALL SYSTEMS OPERATIONAL!**

---

## 📚 Additional Resources

- [Backend README](backend/README.md) - Detailed API documentation
- [XGBoost Documentation](https://xgboost.readthedocs.io/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

## 🔒 Security Checklist

Before production deployment:

- [ ] HTTPS enabled on API
- [ ] Environment variables secured
- [ ] Rate limiting configured
- [ ] Input validation enabled
- [ ] Error messages don't leak sensitive info
- [ ] CORS properly configured
- [ ] API keys stored as secrets
- [ ] Model files not in public repo

---

**Questions?** Review the code comments or check the troubleshooting section above.

