#!/bin/bash

# Quick Start Script for Fever Prediction API
# This script trains the model, starts the API, and runs tests

echo "=========================================="
echo "Fever Prediction API - Quick Start"
echo "=========================================="
echo ""

# Check if we're in the backend directory
if [ ! -f "app.py" ]; then
    echo "❌ Error: Please run this script from the backend/ directory"
    exit 1
fi

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Step 2: Train model
echo "🤖 Step 2: Training XGBoost model..."
python train_fever_model.py
if [ $? -ne 0 ]; then
    echo "❌ Model training failed"
    exit 1
fi
echo "✅ Model trained"
echo ""

# Step 3: Check if model files exist
if [ ! -f "models/fever_model.pkl" ]; then
    echo "❌ Error: Model file not found. Training may have failed."
    exit 1
fi
echo "✅ Model files verified"
echo ""

# Step 4: Start Flask API in background
echo "🚀 Step 3: Starting Flask API..."
python app.py &
FLASK_PID=$!
sleep 3

# Check if Flask started successfully
if ! curl -s http://localhost:5000/api/health > /dev/null; then
    echo "❌ Flask API failed to start"
    kill $FLASK_PID 2>/dev/null
    exit 1
fi
echo "✅ Flask API started (PID: $FLASK_PID)"
echo ""

# Step 5: Run tests
echo "🧪 Step 4: Running validation tests..."
python test_predictions.py
TEST_RESULT=$?
echo ""

# Step 6: Summary
if [ $TEST_RESULT -eq 0 ]; then
    echo "=========================================="
    echo "🎉 SUCCESS! All tests passed!"
    echo "=========================================="
    echo ""
    echo "✅ Model trained and loaded"
    echo "✅ Flask API running on http://localhost:5000"
    echo "✅ All validation scenarios passed"
    echo ""
    echo "Next steps:"
    echo "1. Keep Flask API running (PID: $FLASK_PID)"
    echo "2. Configure Supabase edge function with PYTHON_API_URL"
    echo "3. Test from frontend"
    echo ""
    echo "To stop the API: kill $FLASK_PID"
else
    echo "=========================================="
    echo "⚠️  Some tests failed"
    echo "=========================================="
    kill $FLASK_PID 2>/dev/null
    exit 1
fi

