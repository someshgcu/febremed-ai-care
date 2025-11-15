"""
Test script for fever prediction API with 3 validation scenarios.

This script tests the /api/predict-fever endpoint with the specified scenarios
to verify the model works correctly.
"""

import json
import requests
import sys
from typing import Dict, Any

# API configuration
API_URL = "http://localhost:5000"
ENDPOINT = f"{API_URL}/api/predict-fever"

# Test scenarios
SCENARIOS = [
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
            "BMI": 26.0,
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


def print_separator():
    """Print a visual separator."""
    print("=" * 80)


def test_scenario(scenario: Dict[str, Any]) -> bool:
    """
    Test a single scenario and print results.
    
    Returns:
        bool: True if prediction matches expected, False otherwise
    """
    print_separator()
    print(f"\n{scenario['name']}")
    print_separator()
    
    # Print input data
    print("\nINPUT DATA:")
    print(json.dumps(scenario['data'], indent=2))
    
    try:
        # Make API request
        print(f"\nCalling API: {ENDPOINT}")
        response = requests.post(
            ENDPOINT,
            json=scenario['data'],
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        # Check response status
        if response.status_code != 200:
            print(f"\nAPI ERROR: Status {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        # Parse response
        result = response.json()
        
        # Extract key information
        prediction = result.get("decision", "UNKNOWN")
        confidence = result.get("confidence", 0.0)
        probabilities = result.get("probabilities", {})
        explanation = result.get("explanation", "")
        key_factors = result.get("key_factors", [])
        
        # Print results
        print("\nMODEL PREDICTION:")
        print(f"   Decision: {prediction}")
        print(f"   Expected: {scenario['expected']}")
        print(f"   Confidence: {confidence:.4f} ({confidence*100:.2f}%)")
        
        print("\nALL PROBABILITIES:")
        for label, prob in sorted(probabilities.items(), key=lambda x: x[1], reverse=True):
            print(f"   {label}: {prob:.4f} ({prob*100:.2f}%)")
        
        print("\nEXPLANATION:")
        print(f"   {explanation}")
        
        print("\nKEY FACTORS:")
        for factor in key_factors:
            print(f"   - {factor}")
        
        # Check if prediction matches expected
        is_correct = prediction == scenario['expected']
        
        if is_correct:
            print(f"\nSUCCESS: Prediction matches expected result!")
        else:
            print(f"\nMISMATCH: Expected '{scenario['expected']}', got '{prediction}'")
        
        return is_correct
        
    except requests.exceptions.ConnectionError:
        print(f"\nCONNECTION ERROR: Could not connect to {API_URL}")
        print("   Make sure the Flask server is running:")
        print("   cd backend && python app.py")
        return False
    except requests.exceptions.Timeout:
        print(f"\nTIMEOUT: API request took too long")
        return False
    except Exception as e:
        print(f"\nERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run all test scenarios."""
    print("\n" + "=" * 80)
    print("FEVER PREDICTION MODEL - VALIDATION TEST SUITE")
    print("=" * 80)
    print(f"\nTesting API endpoint: {ENDPOINT}")
    print("\nMake sure the Flask server is running before starting tests!")
    print("Start server with: cd backend && python app.py\n")
    
    # Test health endpoint first
    try:
        health_response = requests.get(f"{API_URL}/api/health", timeout=5)
        if health_response.status_code == 200:
            health_data = health_response.json()
            print(f"OK: API Health Check: {health_data.get('status', 'unknown')}")
            if health_data.get('fever_model_loaded'):
                print("OK: Fever model is loaded")
            else:
                print("WARNING: Fever model is NOT loaded - predictions will fail")
                print("   Run: cd backend && python train_fever_model.py")
        else:
            print(f"WARNING: API Health Check failed: {health_response.status_code}")
    except Exception as e:
        print(f"WARNING: Could not check API health: {e}")
    
    print("\n")
    
    # Run all scenarios
    results = []
    for scenario in SCENARIOS:
        success = test_scenario(scenario)
        results.append((scenario['name'], success))
        print("\n")
    
    # Print summary
    print_separator()
    print("\nTEST SUMMARY")
    print_separator()
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for name, success in results:
        status = "PASS" if success else "FAIL"
        print(f"{status}: {name}")
    
    print(f"\nTotal: {passed}/{total} scenarios passed")
    
    if passed == total:
        print("\nALL TESTS PASSED!")
        return 0
    else:
        print(f"\n{total - passed} test(s) failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())

