// Simple Flask health test using built-in modules
import http from 'http';

const testFlaskHealth = () => {
  console.log('🔍 Testing Flask server health...');
  
  const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('✅ Flask server is healthy!');
        console.log('📊 Status:', result);
        
        if (result.fever_model_loaded) {
          console.log('🧠 Fever prediction model: LOADED');
        } else {
          console.log('⚠️  Fever prediction model: NOT LOADED');
        }
      } catch (error) {
        console.log('❌ Invalid response from Flask server');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Flask server test failed:');
    console.error('   Error:', error.message);
    console.log('\n💡 Solutions:');
    console.log('   1. Start Flask server: cd backend && python app.py');
    console.log('   2. Check if port 5000 is available');
    console.log('   3. Verify .env configuration');
  });

  req.setTimeout(5000, () => {
    console.log('❌ Flask server test timed out');
    req.destroy();
  });

  req.end();
};

// Run the test
testFlaskHealth();