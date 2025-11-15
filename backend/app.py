import json
import logging
import os
import pickle
from pathlib import Path
from typing import Any, Dict, Optional

import numpy as np
import pandas as pd
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
from google.api_core import exceptions as google_exceptions
import google.generativeai as genai
import pytesseract
import xgboost as xgb

load_dotenv()

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Gemini once during startup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logger.warning("GEMINI_API_KEY is not set. /api/extract-medication will return an error until configured.")
else:
    genai.configure(api_key=GEMINI_API_KEY)

# Optional override for Tesseract executable path (useful on Windows installations)
TESSERACT_CMD = os.getenv("TESSERACT_CMD")
if TESSERACT_CMD:
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD
    logger.info("Using custom Tesseract command: %s", TESSERACT_CMD)
elif os.name == "nt":
    potential_paths = [
        Path("C:/Program Files/Tesseract-OCR/tesseract.exe"),
        Path("C:/Program Files (x86)/Tesseract-OCR/tesseract.exe"),
    ]
    for candidate in potential_paths:
        if candidate.exists():
            pytesseract.pytesseract.tesseract_cmd = str(candidate)
            logger.info("Detected Tesseract installation at %s", candidate)
            break
    else:
        logger.warning("Tesseract executable not found. Set TESSERACT_CMD in .env if installed elsewhere.")
else:
    logger.debug("Using system PATH to locate Tesseract executable.")

try:
    pytesseract.get_tesseract_version()
except pytesseract.TesseractNotFoundError:
    logger.warning("pytesseract could not locate Tesseract. Ensure it is installed and accessible.")

DEFAULT_MODEL = "models/gemini-flash-latest"
MODEL_NAME = os.getenv("GEMINI_MODEL", DEFAULT_MODEL)

if MODEL_NAME == DEFAULT_MODEL:
    logger.info("Using default Gemini model: %s", MODEL_NAME)
else:
    logger.info("Using custom Gemini model: %s", MODEL_NAME)

# Load XGBoost fever prediction model
FEVER_MODEL_DIR = Path(__file__).parent / "models"
FEVER_MODEL_PATH = FEVER_MODEL_DIR / "fever_model.pkl"
FEVER_FEATURE_NAMES_PATH = FEVER_MODEL_DIR / "feature_names.json"
FEVER_LABEL_ENCODER_PATH = FEVER_MODEL_DIR / "label_encoder.pkl"

fever_model: Optional[xgb.XGBClassifier] = None
fever_label_encoder: Optional[Any] = None
fever_feature_names: Optional[list] = None

def load_fever_model():
    """Load XGBoost fever prediction model on startup."""
    global fever_model, fever_label_encoder, fever_feature_names
    
    try:
        if not FEVER_MODEL_PATH.exists():
            logger.warning(f"Fever model not found at {FEVER_MODEL_PATH}. Run train_fever_model.py first.")
            return
        
        logger.info(f"Loading fever prediction model from {FEVER_MODEL_PATH}...")
        
        with open(FEVER_MODEL_PATH, 'rb') as f:
            fever_model = pickle.load(f)
        
        with open(FEVER_LABEL_ENCODER_PATH, 'rb') as f:
            fever_label_encoder = pickle.load(f)
        
        with open(FEVER_FEATURE_NAMES_PATH, 'r') as f:
            fever_feature_names = json.load(f)
        
        logger.info("✅ Fever prediction model loaded successfully!")
        logger.info(f"   Features: {fever_feature_names}")
        logger.info(f"   Classes: {fever_label_encoder.classes_.tolist()}")
    except Exception as e:
        logger.error(f"Failed to load fever model: {e}", exc_info=True)
        logger.warning("Fever prediction endpoint will not be available until model is loaded.")

# Load model on startup
load_fever_model()


def _build_gemini_prompt(extracted_text: str) -> str:
    return (
        "You are a medical text analyzer. Analyze this prescription text and extract medication information.\n\n"
        "PRESCRIPTION TEXT:\n"
        f"{extracted_text}\n\n"
        "TASK:\n"
        "1. Identify the medication name\n"
        "2. Classify medication type:\n"
        "   - Antipyretic (fever reducers: Paracetamol, Ibuprofen, Aspirin)\n"
        "   - Antibiotic (bacteria killers: Amoxicillin, Azithromycin, etc.)\n"
        "   - Antiviral (virus fighters: Oseltamivir, Acyclovir, etc.)\n"
        "   - Other\n"
        "3. Extract dosage, frequency, duration if present\n\n"
        "RESPOND ONLY in valid JSON (no markdown, no extra text):\n"
        "{\n"
        "    \"medication_name\": \"exact name from prescription\",\n"
        "    \"medication_type\": \"Antipyretic|Antibiotic|Antiviral|Other\",\n"
        "    \"dosage\": \"amount and unit or null\",\n"
        "    \"frequency\": \"times per day or schedule or null\",\n"
        "    \"duration_days\": \"number of days or null\",\n"
        "    \"confidence\": \"high|medium|low\",\n"
        "    \"extracted_text\": \"the raw OCR text\"\n"
        "}"
    )


def _parse_gemini_response(response: Any) -> Dict[str, Any]:
    """Safely extract JSON payload from Gemini response."""
    raw_text = getattr(response, "text", "")

    if not raw_text and hasattr(response, "candidates"):
        # Fall back to candidates structure if text is not populated
        for candidate in response.candidates:
            content = getattr(candidate, "content", None)
            parts = getattr(content, "parts", []) if content else []
            for part in parts:
                if hasattr(part, "text"):
                    raw_text = part.text
                    break
            if raw_text:
                break

    if not raw_text:
        raise ValueError("Empty response from Gemini model")

    cleaned = raw_text.strip()
    # Remove backticks if Gemini wrapped the JSON in a code block
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        cleaned = cleaned.replace("json\n", "", 1).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as exc:
        logger.error("Failed to parse Gemini response: %s", cleaned)
        raise ValueError("Failed to parse Gemini response as JSON") from exc


@app.route("/api/extract-medication", methods=["POST"])
def extract_medication():
    if request.method != "POST":
        return jsonify({"error": "Method not allowed"}), 405

    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    if not GEMINI_API_KEY:
        return jsonify({"error": "GEMINI_API_KEY is not configured"}), 500

    try:
        image_file = request.files["image"]
        image = Image.open(image_file.stream)
        image = image.convert("RGB")  # Normalize to avoid mode-related OCR issues

        logger.info("Running OCR on uploaded image")
        extracted_text = pytesseract.image_to_string(image)

        if not extracted_text or not extracted_text.strip():
            return jsonify({"error": "Could not extract text from image. Please use a clearer photo."}), 400

        logger.info("Extracted text length: %d", len(extracted_text))

        logger.info("Calling Gemini model: %s", MODEL_NAME)
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = _build_gemini_prompt(extracted_text)
        response = model.generate_content(prompt)

        medication_data = _parse_gemini_response(response)

        if "extracted_text" not in medication_data or not medication_data["extracted_text"]:
            medication_data["extracted_text"] = extracted_text

        return (
            jsonify(
                {
                    "success": True,
                    "medication_data": medication_data,
                    "extracted_text": extracted_text,
                }
            ),
            200,
        )
    except pytesseract.TesseractNotFoundError:
        logger.exception("Tesseract executable not found")
        return jsonify({"error": "Tesseract OCR is not installed or not found in PATH."}), 500
    except google_exceptions.ResourceExhausted:
        logger.exception("Gemini quota exceeded")
        return (
            jsonify(
                {
                    "error": "Gemini quota exceeded. Please wait a moment or switch to a lighter model such as models/gemini-flash-lite-latest."
                }
            ),
            429,
        )
    except google_exceptions.GoogleAPIError as exc:
        logger.exception("Gemini API error")
        return jsonify({"error": f"Gemini API error: {exc}"}), 502
    except ValueError as exc:
        logger.exception("Validation error during extraction")
        return jsonify({"error": str(exc)}), 500
    except Exception as exc:
        logger.exception("Unexpected error during extraction")
        return jsonify({"error": str(exc)}), 500


def _normalize_patient_data(patient_data: Dict[str, Any]) -> Dict[str, float]:
    """
    Normalize patient data from frontend format to model feature format.
    
    Frontend format:
    - temperature, age, duration, compliance, symptoms (array), comorbidities (array)
    
    Model format:
    - Temperature, Age, BMI, Fever_Duration, Compliance_Rate, Headache, Body_Ache, Fatigue, Chronic_Conditions
    """
    # Extract base features
    temperature = float(patient_data.get("temperature", patient_data.get("Temperature", 37.0)))
    age = float(patient_data.get("age", patient_data.get("Age", 30)))
    fever_duration = float(patient_data.get("duration", patient_data.get("Fever_Duration", patient_data.get("fever_duration", 3))))
    compliance_rate = float(patient_data.get("compliance", patient_data.get("Compliance_Rate", patient_data.get("compliance_rate", 80))))
    
    # BMI: use provided BMI or estimate from age (simple heuristic)
    bmi = patient_data.get("BMI", patient_data.get("bmi"))
    if bmi is None:
        # Simple BMI estimation (not medically accurate, but reasonable default)
        bmi = 22.0 + (age - 30) * 0.1  # Rough estimate
    bmi = float(bmi)
    
    # Symptoms: convert array to binary flags
    symptoms = patient_data.get("symptoms", [])
    if isinstance(symptoms, list):
        symptoms_lower = [s.lower() if isinstance(s, str) else str(s).lower() for s in symptoms]
        headache = 1 if any("headache" in s for s in symptoms_lower) else patient_data.get("Headache", 0)
        body_ache = 1 if any("body" in s or "ache" in s or "pain" in s for s in symptoms_lower) else patient_data.get("Body_Ache", 0)
        fatigue = 1 if any("fatigue" in s or "tired" in s or "weak" in s for s in symptoms_lower) else patient_data.get("Fatigue", 0)
    else:
        headache = int(patient_data.get("Headache", 0))
        body_ache = int(patient_data.get("Body_Ache", 0))
        fatigue = int(patient_data.get("Fatigue", 0))
    
    # Chronic conditions
    comorbidities = patient_data.get("comorbidities", [])
    chronic_conditions = 1 if (isinstance(comorbidities, list) and len(comorbidities) > 0) else int(patient_data.get("Chronic_Conditions", 0))
    
    return {
        "Temperature": temperature,
        "Age": age,
        "BMI": bmi,
        "Fever_Duration": fever_duration,
        "Compliance_Rate": compliance_rate,
        "Headache": int(headache),
        "Body_Ache": int(body_ache),
        "Fatigue": int(fatigue),
        "Chronic_Conditions": int(chronic_conditions)
    }


@app.route("/api/predict-fever", methods=["POST"])
def predict_fever():
    """
    Predict fever recovery decision using XGBoost model.
    
    Expected input format:
    {
        "patientData": {
            "temperature": 38.5,
            "age": 30,
            "duration": 3,
            "compliance": 85,
            "symptoms": ["Headache", "Body ache"],
            "comorbidities": [],
            ...
        }
    }
    
    Or direct format (for testing):
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
    """
    if request.method != "POST":
        return jsonify({"error": "Method not allowed"}), 405
    
    if fever_model is None or fever_label_encoder is None or fever_feature_names is None:
        return jsonify({
            "error": "Fever prediction model not loaded",
            "details": "Run train_fever_model.py to train and save the model first."
        }), 503
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400
        
        # Handle both formats: nested patientData or direct format
        if "patientData" in data:
            patient_data = data["patientData"]
        else:
            patient_data = data
        
        # Normalize to model format
        normalized_data = _normalize_patient_data(patient_data)
        
        logger.info(f"Predicting with features: {normalized_data}")
        
        # Create DataFrame with correct feature order
        feature_df = pd.DataFrame([normalized_data], columns=fever_feature_names)
        
        # Predict
        prediction_encoded = fever_model.predict(feature_df)[0]
        prediction = fever_label_encoder.inverse_transform([prediction_encoded])[0]
        
        # Get probabilities
        probabilities = fever_model.predict_proba(feature_df)[0]
        prob_dict = {
            label: float(prob) 
            for label, prob in zip(fever_label_encoder.classes_, probabilities)
        }
        
        # Get confidence (max probability)
        confidence = float(max(probabilities))
        
        # Calculate recovery probability based on decision
        # For LIKELY_SAFE_TO_STOP: use that probability
        # For CONTINUE: use probability of LIKELY_SAFE_TO_STOP (recovery potential)
        # For CONSULT_DOCTOR: use complement of CONSULT_DOCTOR probability (1 - consult_prob)
        if prediction == "LIKELY_SAFE_TO_STOP":
            recovery_probability = float(prob_dict.get("LIKELY_SAFE_TO_STOP", 0.0))
        elif prediction == "CONTINUE":
            # Recovery potential = probability of safe to stop
            recovery_probability = float(prob_dict.get("LIKELY_SAFE_TO_STOP", 0.0))
        else:  # CONSULT_DOCTOR
            # Recovery probability = 1 - probability of consulting doctor
            # This shows the chance of NOT needing to consult (i.e., recovery potential)
            consult_prob = float(prob_dict.get("CONSULT_DOCTOR", 0.0))
            recovery_probability = 1.0 - consult_prob
        
        # Determine risk assessment based on prediction and features
        risk_assessment = "MEDIUM"
        if prediction == "CONSULT_DOCTOR":
            risk_assessment = "HIGH"
        elif prediction == "LIKELY_SAFE_TO_STOP":
            risk_assessment = "LOW"
        
        # Generate explanation
        explanation = _generate_explanation(prediction, normalized_data, prob_dict, confidence)
        
        # Build response
        response = {
            "decision": prediction,
            "recovery_probability": recovery_probability,
            "confidence": confidence,
            "explanation": explanation,
            "key_factors": _get_key_factors(normalized_data, prediction),
            "risk_assessment": risk_assessment,
            "next_steps": _get_next_steps(prediction),
            "warning_signs": _get_warning_signs(normalized_data),
            "doctor_note": "This is an AI-assisted prediction. Always consult a healthcare professional for medical decisions.",
            "probabilities": prob_dict,
            "input_features": normalized_data
        }
        
        logger.info(f"Prediction: {prediction} (confidence: {confidence:.2%})")
        
        return jsonify(response), 200
        
    except KeyError as e:
        logger.exception("Missing required field in request")
        return jsonify({"error": f"Missing required field: {e}"}), 400
    except ValueError as e:
        logger.exception("Invalid input data")
        return jsonify({"error": f"Invalid input: {e}"}), 400
    except Exception as e:
        logger.exception("Unexpected error during prediction")
        return jsonify({"error": str(e)}), 500


def _generate_explanation(prediction: str, features: Dict[str, float], probabilities: Dict[str, float], confidence: float) -> str:
    """Generate human-readable explanation for the prediction."""
    temp = features["Temperature"]
    duration = features["Fever_Duration"]
    compliance = features["Compliance_Rate"]
    
    if prediction == "CONTINUE":
        return f"Based on your temperature of {temp}°C, {duration} days of fever, and {compliance}% medication compliance, it's recommended to continue your current treatment. Monitor symptoms closely."
    elif prediction == "CONSULT_DOCTOR":
        return f"Given your temperature of {temp}°C, {duration} days of fever, and {compliance}% compliance, it's advisable to consult a healthcare professional for further evaluation."
    else:  # LIKELY_SAFE_TO_STOP
        return f"With a temperature of {temp}°C, {duration} days of fever, and {compliance}% compliance, it may be safe to consider stopping medication. However, always consult your doctor before making changes."


def _get_key_factors(features: Dict[str, float], prediction: str) -> list:
    """Extract key factors influencing the decision."""
    factors = []
    
    temp = features["Temperature"]
    if temp > 38.5:
        factors.append(f"Elevated temperature ({temp}°C)")
    elif temp < 37.5:
        factors.append(f"Normal temperature ({temp}°C)")
    
    duration = features["Fever_Duration"]
    if duration > 7:
        factors.append(f"Prolonged fever duration ({duration} days)")
    
    compliance = features["Compliance_Rate"]
    if compliance < 60:
        factors.append(f"Low medication compliance ({compliance}%)")
    elif compliance > 90:
        factors.append(f"Excellent medication compliance ({compliance}%)")
    
    if features["Chronic_Conditions"]:
        factors.append("Presence of chronic conditions")
    
    symptom_count = features["Headache"] + features["Body_Ache"] + features["Fatigue"]
    if symptom_count > 2:
        factors.append(f"Multiple symptoms present ({symptom_count})")
    
    return factors if factors else ["Standard recovery parameters"]


def _get_next_steps(prediction: str) -> list:
    """Get recommended next steps based on prediction."""
    if prediction == "CONTINUE":
        return [
            "Continue taking medication as prescribed",
            "Monitor temperature twice daily",
            "Maintain good hydration",
            "Get adequate rest",
            "Contact doctor if symptoms worsen"
        ]
    elif prediction == "CONSULT_DOCTOR":
        return [
            "Schedule an appointment with your healthcare provider",
            "Continue medication until doctor's visit",
            "Monitor symptoms closely",
            "Seek immediate care if symptoms worsen",
            "Prepare a list of symptoms and medication history"
        ]
    else:  # LIKELY_SAFE_TO_STOP
        return [
            "Consult your doctor before stopping medication",
            "Gradually reduce medication if approved by doctor",
            "Continue monitoring temperature",
            "Watch for symptom recurrence",
            "Maintain healthy lifestyle habits"
        ]


def _get_warning_signs(features: Dict[str, float]) -> list:
    """Get warning signs to watch for."""
    warnings = []
    
    if features["Temperature"] > 39.0:
        warnings.append("High fever (>39°C) - seek medical attention if persistent")
    
    if features["Fever_Duration"] > 7:
        warnings.append("Fever lasting more than 7 days - consult doctor")
    
    if features["Compliance_Rate"] < 60:
        warnings.append("Low medication compliance may affect recovery")
    
    if features["Chronic_Conditions"]:
        warnings.append("Chronic conditions may complicate recovery - monitor closely")
    
    return warnings if warnings else ["Monitor for any new or worsening symptoms"]


@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    status = {
        "status": "healthy",
        "fever_model_loaded": fever_model is not None
    }
    return jsonify(status), 200


if __name__ == "__main__":
    app.run(debug=os.getenv("FLASK_ENV") == "development", port=int(os.getenv("PORT", 5000)))
