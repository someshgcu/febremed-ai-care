"""
XGBoost Fever Recovery Prediction Model Training Script
=======================================================

This script trains an XGBoost classifier to predict fever recovery decisions:
- CONTINUE: Continue medication
- CONSULT_DOCTOR: Consult a doctor
- LIKELY_SAFE_TO_STOP: Likely safe to stop medication

Features:
- Temperature (°C)
- Age (years)
- BMI (Body Mass Index)
- Fever_Duration (days)
- Compliance_Rate (0-100%)
- Headache (0/1)
- Body_Ache (0/1)
- Fatigue (0/1)
- Chronic_Conditions (0/1)

Target: Decision (CONTINUE, CONSULT_DOCTOR, LIKELY_SAFE_TO_STOP)
"""

import json
import logging
import os
import pickle
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Model configuration
MODEL_DIR = Path(__file__).parent / "models"
MODEL_DIR.mkdir(exist_ok=True)
MODEL_PATH = MODEL_DIR / "fever_model.pkl"
FEATURE_NAMES_PATH = MODEL_DIR / "feature_names.json"
LABEL_ENCODER_PATH = MODEL_DIR / "label_encoder.pkl"

# Feature names (must match training data)
FEATURE_NAMES = [
    "Temperature",
    "Age",
    "BMI",
    "Fever_Duration",
    "Compliance_Rate",
    "Headache",
    "Body_Ache",
    "Fatigue",
    "Chronic_Conditions"
]

# Decision labels
DECISION_LABELS = ["CONTINUE", "CONSULT_DOCTOR", "LIKELY_SAFE_TO_STOP"]


def generate_synthetic_data(n_samples: int = 6000) -> Tuple[pd.DataFrame, pd.Series]:
    """
    Generate balanced synthetic training data based on medical logic.
    
    Rules (aligned with test scenarios):
    - CONTINUE: High temp (38.5-39.5°C), short duration (1-5 days), good compliance (>75%), symptoms present
    - CONSULT_DOCTOR: Moderate-high temp (>37.5°C), low compliance (<65%), OR long duration (>5 days), OR chronic conditions
    - LIKELY_SAFE_TO_STOP: Low temp (<37.5°C), long duration (>6 days), excellent compliance (>90%), minimal symptoms
    """
    np.random.seed(42)
    data = []
    labels = []
    
    # Generate balanced samples per class
    samples_per_class = n_samples // 3
    
    logger.info(f"Generating {n_samples} balanced synthetic samples ({samples_per_class} per class)...")
    
    # Generate CONTINUE samples
    for i in range(samples_per_class):
        # CONTINUE: High temp, short duration, good compliance, symptoms
        temperature = np.random.uniform(38.5, 39.5)  # High fever
        fever_duration = np.random.randint(1, 5)  # Short duration
        compliance_rate = np.random.uniform(75, 100)  # Good compliance
        age = np.random.randint(18, 65)
        bmi = np.random.uniform(20, 28)
        headache = np.random.choice([0, 1], p=[0.2, 0.8])  # Usually has symptoms
        body_ache = np.random.choice([0, 1], p=[0.3, 0.7])
        fatigue = np.random.choice([0, 1], p=[0.2, 0.8])
        chronic_conditions = 0  # Usually no chronic conditions
        
        data.append([
            temperature, age, bmi, fever_duration, compliance_rate,
            headache, body_ache, fatigue, chronic_conditions
        ])
        labels.append("CONTINUE")
    
    # Generate CONSULT_DOCTOR samples
    for i in range(samples_per_class):
        # CONSULT_DOCTOR: Various risk factors
        if np.random.random() < 0.4:
            # Low compliance case
            temperature = np.random.uniform(37.5, 39.0)
            compliance_rate = np.random.uniform(40, 65)  # Low compliance
            fever_duration = np.random.randint(2, 8)
        elif np.random.random() < 0.7:
            # Long duration case
            temperature = np.random.uniform(37.5, 38.5)
            compliance_rate = np.random.uniform(60, 85)
            fever_duration = np.random.randint(5, 12)  # Long duration
        else:
            # Chronic conditions case
            temperature = np.random.uniform(37.5, 39.0)
            compliance_rate = np.random.uniform(50, 90)
            fever_duration = np.random.randint(2, 10)
            chronic_conditions = 1
            age = np.random.randint(35, 75)  # Older with chronic conditions
            bmi = np.random.uniform(22, 32)
            data.append([
                temperature, age, bmi, fever_duration, compliance_rate,
                np.random.choice([0, 1]), np.random.choice([0, 1]),
                np.random.choice([0, 1]), chronic_conditions
            ])
            labels.append("CONSULT_DOCTOR")
            continue
        
        age = np.random.randint(18, 70)
        bmi = np.random.uniform(20, 30)
        chronic_conditions = 0 if np.random.random() > 0.3 else 1
        
        data.append([
            temperature, age, bmi, fever_duration, compliance_rate,
            np.random.choice([0, 1], p=[0.3, 0.7]),
            np.random.choice([0, 1], p=[0.4, 0.6]),
            np.random.choice([0, 1], p=[0.3, 0.7]),
            chronic_conditions
        ])
        labels.append("CONSULT_DOCTOR")
    
    # Generate LIKELY_SAFE_TO_STOP samples
    for i in range(samples_per_class):
        # LIKELY_SAFE_TO_STOP: Low temp, long duration, excellent compliance, minimal symptoms
        temperature = np.random.uniform(36.5, 37.5)  # Low/normal temp
        fever_duration = np.random.randint(6, 12)  # Long duration (recovering)
        compliance_rate = np.random.uniform(90, 100)  # Excellent compliance
        age = np.random.randint(18, 50)
        bmi = np.random.uniform(20, 26)
        # Minimal symptoms (recovering)
        symptom_prob = 0.2  # Low probability of symptoms
        headache = np.random.choice([0, 1], p=[1-symptom_prob, symptom_prob])
        body_ache = np.random.choice([0, 1], p=[1-symptom_prob, symptom_prob])
        fatigue = np.random.choice([0, 1], p=[1-symptom_prob, symptom_prob])
        chronic_conditions = 0  # No chronic conditions
        
        data.append([
            temperature, age, bmi, fever_duration, compliance_rate,
            headache, body_ache, fatigue, chronic_conditions
        ])
        labels.append("LIKELY_SAFE_TO_STOP")
    
    # Add some noise/variation (10% of samples with random assignment)
    noise_count = int(n_samples * 0.1)
    for i in range(noise_count):
        idx = np.random.randint(0, len(data))
        # Randomly change label
        labels[idx] = np.random.choice(DECISION_LABELS)
    
    df = pd.DataFrame(data, columns=FEATURE_NAMES)
    y = pd.Series(labels)
    
    logger.info(f"Generated data distribution:\n{y.value_counts()}")
    return df, y


def train_model(X: pd.DataFrame, y: pd.Series) -> Tuple[xgb.XGBClassifier, LabelEncoder]:
    """
    Train XGBoost classifier with hyperparameter tuning.
    """
    logger.info("Training XGBoost model...")
    
    # Encode labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    logger.info(f"Training set: {len(X_train)} samples")
    logger.info(f"Test set: {len(X_test)} samples")
    
    # Calculate class weights for balanced training
    from collections import Counter
    class_counts = Counter(y_encoded)
    total_samples = len(y_encoded)
    class_weights = {i: total_samples / (len(class_counts) * count) 
                     for i, count in class_counts.items()}
    
    logger.info(f"Class weights: {class_weights}")
    
    # XGBoost parameters (optimized for medical classification with class weights)
    params = {
        'objective': 'multi:softprob',
        'num_class': len(DECISION_LABELS),
        'max_depth': 6,
        'learning_rate': 0.1,
        'n_estimators': 200,
        'subsample': 0.8,
        'colsample_bytree': 0.8,
        'min_child_weight': 3,
        'gamma': 0.1,
        'reg_alpha': 0.1,
        'reg_lambda': 1.0,
        'random_state': 42,
        'eval_metric': 'mlogloss',
        'scale_pos_weight': 1.0  # Will use sample_weight instead
    }
    
    # Calculate sample weights for balanced training
    sample_weights_train = np.array([class_weights[y] for y in y_train])
    sample_weights_test = np.array([class_weights[y] for y in y_test])
    
    # Train model with class weights
    model = xgb.XGBClassifier(**params)
    model.fit(
        X_train, y_train,
        sample_weight=sample_weights_train,
        eval_set=[(X_test, y_test)],
        verbose=False
    )
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    logger.info("\n" + "="*60)
    logger.info(f"MODEL ACCURACY: {accuracy:.4f} ({accuracy*100:.2f}%)")
    logger.info("="*60)
    
    if accuracy >= 0.90:
        logger.info("✅ EXCELLENT: Model accuracy >= 90%")
    elif accuracy >= 0.85:
        logger.info("✅ GOOD: Model accuracy >= 85%")
    else:
        logger.warning("⚠️  Model accuracy < 85%. Consider tuning hyperparameters.")
    
    # Classification report
    logger.info("\nClassification Report:")
    logger.info("\n" + classification_report(
        y_test, y_pred,
        target_names=label_encoder.classes_,
        digits=4,
        zero_division=0
    ))
    
    # Confusion matrix
    logger.info("\nConfusion Matrix:")
    cm = confusion_matrix(y_test, y_pred)
    logger.info(f"\n{cm}")
    
    return model, label_encoder


def save_model(model: xgb.XGBClassifier, label_encoder: LabelEncoder):
    """
    Save model and metadata to disk.
    """
    logger.info(f"Saving model to {MODEL_PATH}...")
    
    # Save model
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)
    
    # Save label encoder
    with open(LABEL_ENCODER_PATH, 'wb') as f:
        pickle.dump(label_encoder, f)
    
    # Save feature names
    with open(FEATURE_NAMES_PATH, 'w') as f:
        json.dump(FEATURE_NAMES, f, indent=2)
    
    logger.info("✅ Model saved successfully!")
    logger.info(f"   - Model: {MODEL_PATH}")
    logger.info(f"   - Label Encoder: {LABEL_ENCODER_PATH}")
    logger.info(f"   - Feature Names: {FEATURE_NAMES_PATH}")


def test_sample_predictions(model: xgb.XGBClassifier, label_encoder: LabelEncoder):
    """
    Test model with sample scenarios.
    """
    logger.info("\n" + "="*60)
    logger.info("TESTING SAMPLE PREDICTIONS")
    logger.info("="*60)
    
    # Test scenarios
    scenarios = [
        {
            "name": "SCENARIO 1: Should CONTINUE",
            "data": {
                "Temperature": 39.2,
                "Age": 28,
                "BMI": 24.5,
                "Fever_Duration": 3,
                "Compliance_Rate": 85,
                "Headache": 1,
                "Body_Ache": 1,
                "Fatigue": 1,
                "Chronic_Conditions": 0
            },
            "expected": "CONTINUE"
        },
        {
            "name": "SCENARIO 2: Should CONSULT_DOCTOR",
            "data": {
                "Temperature": 38.0,
                "Age": 35,
                "BMI": 26.0,  # Default BMI if not provided
                "Fever_Duration": 4,
                "Compliance_Rate": 60,
                "Headache": 1,
                "Body_Ache": 0,
                "Fatigue": 0,
                "Chronic_Conditions": 0
            },
            "expected": "CONSULT_DOCTOR"
        },
        {
            "name": "SCENARIO 3: Should LIKELY_SAFE_TO_STOP",
            "data": {
                "Temperature": 37.1,
                "Age": 25,
                "BMI": 22.0,
                "Fever_Duration": 7,
                "Compliance_Rate": 95,
                "Headache": 0,
                "Body_Ache": 0,
                "Fatigue": 0,
                "Chronic_Conditions": 0
            },
            "expected": "LIKELY_SAFE_TO_STOP"
        }
    ]
    
    for scenario in scenarios:
        logger.info(f"\n{scenario['name']}")
        logger.info("-" * 60)
        logger.info(f"Input Data: {json.dumps(scenario['data'], indent=2)}")
        
        # Prepare features
        X_test = pd.DataFrame([scenario['data']], columns=FEATURE_NAMES)
        
        # Predict
        prediction_encoded = model.predict(X_test)[0]
        prediction = label_encoder.inverse_transform([prediction_encoded])[0]
        
        # Get probabilities
        probabilities = model.predict_proba(X_test)[0]
        prob_dict = {
            label: float(prob) 
            for label, prob in zip(label_encoder.classes_, probabilities)
        }
        
        # Get confidence (max probability)
        confidence = float(max(probabilities))
        
        logger.info(f"\nPrediction: {prediction}")
        logger.info(f"Expected: {scenario['expected']}")
        logger.info(f"Confidence: {confidence:.4f} ({confidence*100:.2f}%)")
        logger.info(f"\nAll Probabilities:")
        for label, prob in sorted(prob_dict.items(), key=lambda x: x[1], reverse=True):
            logger.info(f"  {label}: {prob:.4f} ({prob*100:.2f}%)")
        
        if prediction == scenario['expected']:
            logger.info(f"✅ CORRECT PREDICTION")
        else:
            logger.warning(f"⚠️  MISMATCH: Expected {scenario['expected']}, got {prediction}")


def main():
    """
    Main training pipeline.
    """
    logger.info("="*60)
    logger.info("FEVER RECOVERY PREDICTION MODEL TRAINING")
    logger.info("="*60)
    
    # Generate synthetic data
    X, y = generate_synthetic_data(n_samples=5000)
    
    # Train model
    model, label_encoder = train_model(X, y)
    
    # Save model
    save_model(model, label_encoder)
    
    # Test sample predictions
    test_sample_predictions(model, label_encoder)
    
    logger.info("\n" + "="*60)
    logger.info("TRAINING COMPLETE!")
    logger.info("="*60)
    logger.info(f"\nModel files saved in: {MODEL_DIR}")
    logger.info("\nNext steps:")
    logger.info("1. Verify model accuracy meets requirements (>=85%)")
    logger.info("2. Deploy Flask API with /api/predict-fever endpoint")
    logger.info("3. Update Supabase edge function to call Python API")
    logger.info("4. Test end-to-end integration")


if __name__ == "__main__":
    main()

