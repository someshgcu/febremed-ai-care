// Test Flask server health
import fetch from 'node-fetch';

const testFlaskHealth = async () => {
  try {
    console.log('🔍 Testing Flask server health...');
    
    const response = await fetch('http://127.0.0.1:5000/api/health');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Flask server is healthy!');
    console.log('📊 Status:', data);
    
    if (data.fever_model_loaded) {
      console.log('🧠 Fever prediction model: LOADED');
    } else {
      console.log('⚠️  Fever prediction model: NOT LOADED');
    }
    
  } catch (error) {
    console.error('❌ Flask server test failed:');
    console.error('   Error:', error.message);
    console.log('\n💡 Solutions:');
    console.log('   1. Start Flask server: cd backend && python app.py');
    console.log('   2. Check if port 5000 is available');
    console.log('   3. Verify .env configuration');
  }
};

// Run the test
testFlaskHealth();