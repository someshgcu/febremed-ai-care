"""
Test script to verify recovery_probability calculation is correct.
"""

import requests
import json

API_URL = "http://localhost:5000/api/predict-fever"

# Test the scenario that showed 8% recovery probability
test_data = {
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

print("Testing recovery_probability calculation...")
print(f"\nInput: {json.dumps(test_data, indent=2)}")

try:
    response = requests.post(
        API_URL,
        json=test_data,
        headers={"Content-Type": "application/json"},
        timeout=10
    )
    
    if response.status_code == 200:
        result = response.json()
        
        print(f"\nAPI Response:")
        print(f"Decision: {result.get('decision')}")
        print(f"Recovery Probability: {result.get('recovery_probability'):.4f} ({result.get('recovery_probability')*100:.2f}%)")
        print(f"Confidence: {result.get('confidence'):.4f} ({result.get('confidence')*100:.2f}%)")
        print(f"\nAll Probabilities:")
        for label, prob in result.get('probabilities', {}).items():
            print(f"  {label}: {prob:.4f} ({prob*100:.2f}%)")
        
        # Verify calculation
        decision = result.get('decision')
        recovery_prob = result.get('recovery_probability')
        probabilities = result.get('probabilities', {})
        
        if decision == "CONSULT_DOCTOR":
            expected = 1.0 - probabilities.get("CONSULT_DOCTOR", 0.0)
            if abs(recovery_prob - expected) < 0.001:
                print(f"\nCORRECT: Recovery probability = 1 - CONSULT_DOCTOR prob = {expected:.4f}")
            else:
                print(f"\nERROR: Expected {expected:.4f}, got {recovery_prob:.4f}")
        elif decision == "LIKELY_SAFE_TO_STOP":
            expected = probabilities.get("LIKELY_SAFE_TO_STOP", 0.0)
            if abs(recovery_prob - expected) < 0.001:
                print(f"\nCORRECT: Recovery probability = LIKELY_SAFE_TO_STOP prob = {expected:.4f}")
            else:
                print(f"\nERROR: Expected {expected:.4f}, got {recovery_prob:.4f}")
        else:  # CONTINUE
            expected = probabilities.get("LIKELY_SAFE_TO_STOP", 0.0)
            if abs(recovery_prob - expected) < 0.001:
                print(f"\nCORRECT: Recovery probability = LIKELY_SAFE_TO_STOP prob = {expected:.4f}")
            else:
                print(f"\nERROR: Expected {expected:.4f}, got {recovery_prob:.4f}")
    else:
        print(f"\nAPI Error: {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"\nError: {e}")

