/**
 * Test script for the analyze-fever edge function
 * Run this to verify the function is working correctly
 * 
 * Usage: node test-edge-function.js
 * 
 * Make sure your .env file has:
 * VITE_SUPABASE_URL=https://pechdovoklsfxssvawdx.supabase.co
 * VITE_SUPABASE_ANON_KEY=your-anon-key-here
 */

// Try to load .env file if dotenv is available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed, that's okay
}

// Get Supabase URL and anon key from environment (support both VITE_ and NEXT_PUBLIC_ prefixes)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pechdovoklsfxssvawdx.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'your-anon-key-here') {
  console.error('❌ ERROR: Supabase anon key is not set');
  console.error('Please add it to your .env file:');
  console.error('VITE_SUPABASE_ANON_KEY=your-anon-key-here');
  console.error('OR');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here');
  process.exit(1);
}

console.log('✅ Using Supabase URL:', SUPABASE_URL);
console.log('✅ Using Supabase Anon Key:', SUPABASE_ANON_KEY.substring(0, 20) + '...');
console.log('');

async function testEdgeFunction() {
  const testData = {
    patientData: {
      age: 35,
      temperature: 38.5,
      duration: 3,
      medicationType: "Antipyretic",
      medicationName: "Paracetamol 500mg",
      location: "Mumbai",
      daysOnMedication: 2,
      compliance: 80,
      symptoms: ["Headache", "Body ache", "Fatigue"],
      comorbidities: []
    }
  };

  console.log('Testing analyze-fever edge function...');
  console.log('Test data:', JSON.stringify(testData, null, 2));
  console.log('\n');

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/analyze-fever`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(testData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    
    if (response.ok) {
      console.log('\n✅ SUCCESS! Function is working correctly.');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('\n❌ ERROR: Function returned an error.');
      console.log('Error:', JSON.stringify(data, null, 2));
      
      if (response.status === 401) {
        console.log('\n💡 SOLUTION: Authentication failed. Check:');
        console.log('   1. VITE_SUPABASE_ANON_KEY is correct in .env file');
        console.log('   2. The anon key matches your Supabase project');
        console.log('   3. Get it from: https://app.supabase.com/project/pechdovoklsfxssvawdx/settings/api');
      } else if (data.error?.includes('GEMINI_API_KEY') || data.details?.includes('GEMINI_API_KEY')) {
        console.log('\n💡 SOLUTION: Set GEMINI_API_KEY as a secret in Supabase:');
        console.log('   1. Go to: https://app.supabase.com/project/pechdovoklsfxssvawdx/settings/functions');
        console.log('   2. Click "Secrets" or "Add Secret"');
        console.log('   3. Add secret: GEMINI_API_KEY = your-gemini-api-key');
        console.log('   4. Wait 1-2 minutes for secret to propagate');
      } else if (response.status === 404) {
        console.log('\n💡 SOLUTION: Function not found. Deploy it first:');
        console.log('   1. Go to: https://app.supabase.com/project/pechdovoklsfxssvawdx/functions');
        console.log('   2. Deploy the analyze-fever function');
        console.log('   Or use CLI: supabase functions deploy analyze-fever');
      }
    }
  } catch (error) {
    console.error('\n❌ FAILED: Request error');
    console.error('Error:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 SOLUTION: Check your Supabase URL and network connection.');
    }
  }
}

// Run the test
testEdgeFunction();

