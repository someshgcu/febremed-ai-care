/**
 * Deploy Supabase Edge Function via Management API
 * 
 * This script uses the Supabase Management API to deploy the edge function.
 * You'll need a service role key or access token.
 * 
 * Usage: node deploy-via-api.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_REF = 'pechdovoklsfxssvawdx';
const FUNCTION_NAME = 'analyze-fever';
const FUNCTION_PATH = path.join(__dirname, 'supabase', 'functions', 'analyze-fever', 'index.ts');

// You'll need to get an access token from Supabase
// Go to: https://app.supabase.com/account/tokens
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'your-access-token-here';

async function deployFunction() {
  console.log('📦 Preparing to deploy edge function...');
  console.log('Function:', FUNCTION_NAME);
  console.log('Project:', PROJECT_REF);
  console.log('');

  // Read the function code
  if (!fs.existsSync(FUNCTION_PATH)) {
    console.error('❌ Function file not found:', FUNCTION_PATH);
    process.exit(1);
  }

  const functionCode = fs.readFileSync(FUNCTION_PATH, 'utf-8');
  console.log('✅ Function code loaded:', functionCode.length, 'characters');
  console.log('');

  if (!ACCESS_TOKEN || ACCESS_TOKEN === 'your-access-token-here') {
    console.error('❌ SUPABASE_ACCESS_TOKEN is not set');
    console.error('');
    console.error('To get an access token:');
    console.error('1. Go to: https://app.supabase.com/account/tokens');
    console.error('2. Create a new access token');
    console.error('3. Set it as: SUPABASE_ACCESS_TOKEN=your-token');
    console.error('');
    console.error('Alternatively, use the Supabase Dashboard to deploy:');
    console.error('https://app.supabase.com/project/' + PROJECT_REF + '/functions');
    process.exit(1);
  }

  try {
    // Note: The actual Supabase Management API endpoint for deploying functions
    // may require different authentication and endpoints. This is a template.
    
    console.log('⚠️  Direct API deployment requires Supabase Management API access.');
    console.log('⚠️  This is complex and may require special permissions.');
    console.log('');
    console.log('💡 RECOMMENDED: Use Supabase Dashboard instead:');
    console.log('   https://app.supabase.com/project/' + PROJECT_REF + '/functions');
    console.log('');
    console.log('Or install Supabase CLI:');
    console.log('   scoop install supabase  (Windows with Scoop)');
    console.log('   choco install supabase  (Windows with Chocolatey)');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

deployFunction();

