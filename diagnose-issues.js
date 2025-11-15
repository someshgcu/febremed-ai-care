// FebreMed Diagnostic Script
import fs from 'fs';
import path from 'path';

console.log('🔍 FebreMed AI Care - Diagnostic Report');
console.log('=====================================\n');

// Check 1: Project structure
console.log('📁 Project Structure:');
const requiredFiles = [
  'package.json',
  'src/App.tsx',
  'src/pages/Assessment.tsx',
  'src/components/PrescriptionUploader.tsx',
  'backend/app.py',
  '.env'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Check 2: Environment variables
console.log('\n🔧 Environment Configuration:');
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  const envVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_PUBLISHABLE_KEY', 
    'GEMINI_API_KEY',
    'TESSERACT_CMD'
  ];
  
  envVars.forEach(varName => {
    const hasVar = envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=""`);
    console.log(`   ${hasVar ? '✅' : '❌'} ${varName}`);
  });
} catch (error) {
  console.log('   ❌ .env file not readable');
}

// Check 3: Dependencies
console.log('\n📦 Key Dependencies:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const keyDeps = [
    'react',
    'react-router-dom',
    '@supabase/supabase-js',
    'sonner',
    'lucide-react'
  ];
  
  keyDeps.forEach(dep => {
    const hasDepency = packageJson.dependencies && packageJson.dependencies[dep];
    console.log(`   ${hasDepency ? '✅' : '❌'} ${dep}`);
  });
} catch (error) {
  console.log('   ❌ package.json not readable');
}

// Check 4: Backend requirements
console.log('\n🐍 Backend Requirements:');
try {
  const reqContent = fs.readFileSync('backend/requirements.txt', 'utf8');
  const pythonDeps = [
    'flask',
    'flask-cors',
    'pillow',
    'pytesseract',
    'google-generativeai'
  ];
  
  pythonDeps.forEach(dep => {
    const hasDep = reqContent.toLowerCase().includes(dep.toLowerCase());
    console.log(`   ${hasDep ? '✅' : '❌'} ${dep}`);
  });
} catch (error) {
  console.log('   ❌ backend/requirements.txt not readable');
}

console.log('\n🚀 Quick Start Commands:');
console.log('   1. Install dependencies: npm install');
console.log('   2. Start all services: start-all-services.bat');
console.log('   3. Test Flask health: node test-flask-health.js');
console.log('   4. Open frontend: http://127.0.0.1:8080');

console.log('\n💡 Common Issues & Solutions:');
console.log('   - Flask not starting: Check Python installation & requirements');
console.log('   - OCR not working: Install Tesseract OCR');
console.log('   - API errors: Verify GEMINI_API_KEY in .env');
console.log('   - Upload fails: Ensure Flask server is running on port 5000');

console.log('\n✅ Diagnostic complete!');