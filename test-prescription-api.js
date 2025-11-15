/**
 * Test script for prescription extraction API
 * Tests if the Flask backend is running and accessible
 */

async function testPrescriptionAPI() {
  console.log('🔍 Testing Prescription Extraction API...\n');

  // Test 1: Check if Flask server is running
  console.log('Test 1: Checking if Flask server is running on port 5000...');
  try {
    const healthResponse = await fetch('http://127.0.0.1:5000/api/health');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Flask server is running:', healthData);
    } else {
      console.log('⚠️  Flask server responded but with error:', healthResponse.status);
    }
  } catch (error) {
    console.log('❌ Flask server is NOT running or not accessible');
    console.log('   Error:', error.message);
    console.log('\n💡 SOLUTION: Start the Flask server:');
    console.log('   cd backend');
    console.log('   python app.py');
    console.log('   (Make sure you have activated the virtual environment)');
    return;
  }

  console.log('\nTest 2: Testing /api/extract-medication endpoint...');
  console.log('⚠️  This requires a real image file to test properly.');
  console.log('   The endpoint expects FormData with an "image" field.');
  
  // Test with a dummy request to see what error we get
  try {
    const formData = new FormData();
    // Create a small test image (1x1 pixel PNG)
    const testImageBlob = new Blob([
      new Uint8Array([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00,
        0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49,
        0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
      ])
    ], { type: 'image/png' });
    
    formData.append('image', testImageBlob, 'test.png');
    
    const response = await fetch('http://127.0.0.1:5000/api/extract-medication', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Endpoint is accessible and working!');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('⚠️  Endpoint responded with error:', response.status);
      console.log('Error:', JSON.stringify(data, null, 2));
      
      if (data.error?.includes('GEMINI_API_KEY')) {
        console.log('\n💡 SOLUTION: Set GEMINI_API_KEY in .env file:');
        console.log('   GEMINI_API_KEY=your-gemini-api-key');
      } else if (data.error?.includes('Tesseract')) {
        console.log('\n💡 SOLUTION: Install Tesseract OCR:');
        console.log('   Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki');
        console.log('   Or set TESSERACT_CMD in .env if installed elsewhere');
      }
    }
  } catch (error) {
    console.log('❌ Error calling endpoint:', error.message);
  }

  console.log('\n📋 Checklist:');
  console.log('   [ ] Flask server is running (python app.py)');
  console.log('   [ ] GEMINI_API_KEY is set in .env');
  console.log('   [ ] Tesseract OCR is installed');
  console.log('   [ ] Virtual environment is activated');
  console.log('   [ ] Dependencies are installed (pip install -r requirements.txt)');
}

testPrescriptionAPI();


