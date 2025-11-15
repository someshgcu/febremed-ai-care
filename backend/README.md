# Fever Recovery Prediction API

Production-ready Flask API with XGBoost model for fever recovery prediction.

## 🎯 Overview

This API provides a machine learning endpoint that predicts fever recovery decisions:
- **CONTINUE**: Continue current medication
- **CONSULT_DOCTOR**: Consult a healthcare professional
- **LIKELY_SAFE_TO_STOP**: Likely safe to stop medication (with doctor approval)

## 📋 Features

- ✅ XGBoost-based prediction model (target: >85% accuracy, goal: >90%)
- ✅ Production-ready error handling and logging
- ✅ Comprehensive input validation
- ✅ Detailed prediction explanations and probabilities
- ✅ Health check endpoint
- ✅ CORS enabled for frontend integration

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Train the Model

```bash
python train_fever_model.py
```

This will:
- Generate synthetic training data (5000 samples)
- Train an XGBoost classifier
- Save model artifacts to `backend/models/`
- Test with 3 validation scenarios
- Print model accuracy (target: >85%)

**Expected Output:**
```
MODEL ACCURACY: 0.XXXX (XX.XX%)
✅ EXCELLENT: Model accuracy >= 90%
```

### 3. Start the Flask Server

```bash
python app.py
```

The API will be available at `http://localhost:5000`

### 4. Test the API

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test prediction endpoint
python test_predictions.py
```

## 📡 API Endpoints

### `GET /api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "fever_model_loaded": true
}
```

### `POST /api/predict-fever`

Predict fever recovery decision.

**Request Body:**
```json
{
  "patientData": {
    "temperature": 38.5,
    "age": 30,
    "duration": 3,
    "compliance": 85,
    "symptoms": ["Headache", "Body ache"],
    "comorbidities": []
  }
}
```

**Or direct format (for testing):**
```json
{
  "Temperature": 38.5,
  "Age": 30,
  "BMI": 24.0,
  "Fever_Duration": 3,
  "Compliance_Rate": 85,
  "Headache": 1,
  "Body_Ache": 1,
  "Fatigue": 0,
  "Chronic_Conditions": 0
}
```

**Response:**
```json
{
  "decision": "CONTINUE",
  "recovery_probability": 0.25,
  "confidence": 0.89,
  "explanation": "Based on your temperature of 38.5°C...",
  "key_factors": ["Elevated temperature (38.5°C)", "Excellent medication compliance (85%)"],
  "risk_assessment": "MEDIUM",
  "next_steps": ["Continue taking medication as prescribed", ...],
  "warning_signs": ["Monitor for any new or worsening symptoms"],
  "doctor_note": "This is an AI-assisted prediction. Always consult a healthcare professional...",
  "probabilities": {
    "CONTINUE": 0.89,
    "CONSULT_DOCTOR": 0.08,
    "LIKELY_SAFE_TO_STOP": 0.03
  },
  "input_features": {
    "Temperature": 38.5,
    "Age": 30,
    ...
  }
}
```

## 🧪 Testing

### Run Validation Scenarios

```bash
python test_predictions.py
```

This tests 3 scenarios:
1. **SCENARIO 1**: Should CONTINUE (high temp, short duration, good compliance)
2. **SCENARIO 2**: Should CONSULT_DOCTOR (moderate temp, low compliance)
3. **SCENARIO 3**: Should LIKELY_SAFE_TO_STOP (low temp, long duration, excellent compliance)

### Manual Testing with cURL

```bash
# Scenario 1: Should CONTINUE
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

## 📦 Model Files

After training, the following files are created in `backend/models/`:

- `fever_model.pkl` - Trained XGBoost model
- `label_encoder.pkl` - Label encoder for decision classes
- `feature_names.json` - Feature names in correct order

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Flask Configuration
FLASK_ENV=development
PORT=5000

# Optional: For prescription extraction (separate feature)
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=models/gemini-flash-latest
TESSERACT_CMD=C:/Program Files/Tesseract-OCR/tesseract.exe
```

## 🚢 Deployment

### Option 1: Render.com

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository**
3. **Configure:**
   - **Build Command:** `cd backend && pip install -r requirements.txt && python train_fever_model.py`
   - **Start Command:** `cd backend && python app.py`
   - **Environment:** Python 3
   - **Environment Variables:**
     - `PORT=5000`
     - `FLASK_ENV=production`

4. **After deployment:**
   - Note your Render URL (e.g., `https://your-api.onrender.com`)
   - Update Supabase edge function with this URL

### Option 2: Railway

1. **Create a new project** on Railway
2. **Deploy from GitHub**
3. **Configure:**
   - **Root Directory:** `backend`
   - **Start Command:** `python app.py`
   - **Build Command:** `pip install -r requirements.txt && python train_fever_model.py`

4. **Add Environment Variables:**
   - `PORT` (Railway sets this automatically)

### Option 3: ngrok (Local Development)

For local development with Supabase:

1. **Install ngrok:**
   ```bash
   # Download from https://ngrok.com/download
   # Or use: npm install -g ngrok
   ```

2. **Start Flask server:**
   ```bash
   cd backend
   python app.py
   ```

3. **Start ngrok tunnel:**
   ```bash
   ngrok http 5000
   ```

4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)

5. **Update Supabase edge function:**
   - Set `PYTHON_API_URL` secret to your ngrok URL

### Option 4: Docker

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Train model on build
RUN python train_fever_model.py

EXPOSE 5000

CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t fever-api .
docker run -p 5000:5000 fever-api
```

## 🔗 Supabase Integration

### Update Edge Function

The Supabase edge function (`supabase/functions/analyze-fever/index.ts`) calls this API.

**Set Environment Secret in Supabase:**
1. Go to Supabase Dashboard → Project Settings → Edge Functions
2. Add secret: `PYTHON_API_URL` = `https://your-deployed-api.com`

**For local development:**
- Use ngrok (see above)
- Or set `PYTHON_API_URL=http://localhost:5000` (only works if Supabase runs locally)

### Test Integration

1. **Start Flask API** (locally or deployed)
2. **Deploy Supabase edge function:**
   ```bash
   supabase functions deploy analyze-fever
   ```
3. **Test from frontend:**
   - Submit assessment form
   - Check browser console for API calls
   - Verify prediction is received

## 📊 Model Performance

### Expected Accuracy

- **Target:** ≥85% accuracy
- **Goal:** ≥90% accuracy

### Model Features

- **Temperature** (°C)
- **Age** (years)
- **BMI** (Body Mass Index)
- **Fever_Duration** (days)
- **Compliance_Rate** (0-100%)
- **Headache** (0/1)
- **Body_Ache** (0/1)
- **Fatigue** (0/1)
- **Chronic_Conditions** (0/1)

### Decision Classes

1. **CONTINUE** - Continue current medication
2. **CONSULT_DOCTOR** - Consult healthcare professional
3. **LIKELY_SAFE_TO_STOP** - Likely safe to stop (with doctor approval)

## 🐛 Troubleshooting

### Model Not Loading

**Error:** `Fever prediction model not loaded`

**Solution:**
1. Run `python train_fever_model.py` to train the model
2. Verify `backend/models/fever_model.pkl` exists
3. Check file permissions

### API Connection Errors

**Error:** `Connection refused` or `Could not connect`

**Solutions:**
1. Verify Flask server is running: `curl http://localhost:5000/api/health`
2. Check firewall settings
3. For Supabase: Ensure `PYTHON_API_URL` is set correctly
4. For ngrok: Verify tunnel is active

### Low Model Accuracy

**If accuracy < 85%:**
1. Increase training samples in `train_fever_model.py` (change `n_samples`)
2. Tune hyperparameters in `train_model()` function
3. Review synthetic data generation logic

## 📝 File Structure

```
backend/
├── app.py                    # Flask API with prediction endpoint
├── train_fever_model.py      # Model training script
├── test_predictions.py       # Validation test script
├── requirements.txt          # Python dependencies
├── models/                   # Model artifacts (created after training)
│   ├── fever_model.pkl
│   ├── label_encoder.pkl
│   └── feature_names.json
└── README.md                 # This file
```

## 🔒 Security Notes

- ⚠️ **Never commit model files** to public repositories
- ⚠️ **Use environment variables** for sensitive configuration
- ⚠️ **Enable HTTPS** in production
- ⚠️ **Add rate limiting** for production deployments
- ⚠️ **Validate all inputs** (already implemented)

## 📚 Additional Resources

- [XGBoost Documentation](https://xgboost.readthedocs.io/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Render Deployment Guide](https://render.com/docs)
- [Railway Deployment Guide](https://docs.railway.app/)

## ✅ Success Checklist

Before deploying to production:

- [ ] Model accuracy ≥85% (preferably ≥90%)
- [ ] All 3 test scenarios pass
- [ ] Flask API starts without errors
- [ ] Health endpoint returns `fever_model_loaded: true`
- [ ] Prediction endpoint returns valid JSON
- [ ] Supabase edge function can reach API
- [ ] Environment variables are set
- [ ] HTTPS is enabled (for production)
- [ ] Error handling works correctly
- [ ] Logging is configured

## 🎉 Success!

If all tests pass, your integration is complete:

1. ✅ **Model trained** with >85% accuracy
2. ✅ **Flask API** serving predictions
3. ✅ **Supabase function** calling Python API
4. ✅ **Frontend** receiving decisions
5. ✅ **All scenarios** validated

**Print success message:** 🎉 **INTEGRATION COMPLETE - ALL SYSTEMS OPERATIONAL!**

---

**Questions?** Check the troubleshooting section or review the code comments for detailed explanations.

