/**
 * Test Script dla Backend Email API
 * 
 * Użycie:
 * node test-email.js
 * 
 * Lub z custom URL:
 * node test-email.js https://your-backend.vercel.app
 */

const API_URL = process.argv[2] || 'http://localhost:3001';

const testData = {
  name: 'Jan Testowy',
  email: 'test@example.com',
  service: 'Tarot Miłosny',
  message: 'To jest testowa wiadomość wysłana przez skrypt test-email.js. Sprawdzam czy backend działa poprawnie i wysyła emaile z auto-reply.'
};

async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...');
  console.log(`URL: ${API_URL}/health`);
  
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Health Check PASSED');
      console.log('Response:', JSON.stringify(data, null, 2));
      return true;
    } else {
      console.log('❌ Health Check FAILED');
      console.log('Status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Health Check ERROR');
    console.log('Error:', error.message);
    return false;
  }
}

async function testSendEmail() {
  console.log('\n📧 Testing Send Email...');
  console.log(`URL: ${API_URL}/api/send-email`);
  console.log('Data:', JSON.stringify(testData, null, 2));
  
  try {
    const response = await fetch(`${API_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    const data = await response.json();
    
    console.log('\n📊 Response:');
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Body:', JSON.stringify(data, null, 2));
    
    if (response.ok && data.success) {
      console.log('\n✅ Email Test PASSED');
      console.log('📬 Check your inbox for:');
      console.log(`   1. Owner notification (${process.env.OWNER_EMAIL || 'configured email'})`);
      console.log(`   2. Auto-reply (${testData.email})`);
      return true;
    } else {
      console.log('\n❌ Email Test FAILED');
      console.log('Reason:', data.message);
      return false;
    }
  } catch (error) {
    console.log('\n❌ Email Test ERROR');
    console.log('Error:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 Tip: Make sure backend is running!');
      console.log('   Run: npm run dev (in /backend/ folder)');
    }
    
    return false;
  }
}

async function testInvalidData() {
  console.log('\n🚫 Testing Invalid Data (Missing Fields)...');
  
  const invalidData = {
    name: 'Test',
    // missing email, service, message
  };
  
  try {
    const response = await fetch(`${API_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidData),
    });
    
    const data = await response.json();
    
    if (response.status === 400 && !data.success) {
      console.log('✅ Invalid Data Test PASSED');
      console.log('Server correctly rejected invalid data:', data.message);
      return true;
    } else {
      console.log('❌ Invalid Data Test FAILED');
      console.log('Server should reject invalid data with 400 status');
      return false;
    }
  } catch (error) {
    console.log('❌ Invalid Data Test ERROR');
    console.log('Error:', error.message);
    return false;
  }
}

async function testInvalidEmail() {
  console.log('\n📧 Testing Invalid Email Address...');
  
  const invalidEmailData = {
    name: 'Test',
    email: 'not-an-email',
    service: 'Test',
    message: 'Test'
  };
  
  try {
    const response = await fetch(`${API_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidEmailData),
    });
    
    const data = await response.json();
    
    if (response.status === 400 && !data.success) {
      console.log('✅ Invalid Email Test PASSED');
      console.log('Server correctly rejected invalid email:', data.message);
      return true;
    } else {
      console.log('❌ Invalid Email Test FAILED');
      console.log('Server should reject invalid email format');
      return false;
    }
  } catch (error) {
    console.log('❌ Invalid Email Test ERROR');
    console.log('Error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║                                                          ║');
  console.log('║        🧪 Wiedźma Samira Backend API Tests 🧪           ║');
  console.log('║                                                          ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`\n🎯 Testing API: ${API_URL}`);
  console.log(`⏰ Started: ${new Date().toLocaleString('pl-PL')}`);
  
  const results = {
    healthCheck: false,
    sendEmail: false,
    invalidData: false,
    invalidEmail: false,
  };
  
  // Test 1: Health Check
  results.healthCheck = await testHealthCheck();
  await sleep(1000);
  
  // Test 2: Send Email (only if health check passed)
  if (results.healthCheck) {
    results.sendEmail = await testSendEmail();
    await sleep(1000);
  } else {
    console.log('\n⏭️  Skipping email tests (health check failed)');
  }
  
  // Test 3: Invalid Data
  if (results.healthCheck) {
    results.invalidData = await testInvalidData();
    await sleep(1000);
  }
  
  // Test 4: Invalid Email
  if (results.healthCheck) {
    results.invalidEmail = await testInvalidEmail();
  }
  
  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('═'.repeat(60));
  
  const tests = [
    { name: 'Health Check', passed: results.healthCheck },
    { name: 'Send Email', passed: results.sendEmail },
    { name: 'Invalid Data Handling', passed: results.invalidData },
    { name: 'Invalid Email Validation', passed: results.invalidEmail },
  ];
  
  tests.forEach(test => {
    const icon = test.passed ? '✅' : '❌';
    const status = test.passed ? 'PASSED' : 'FAILED';
    console.log(`${icon} ${test.name.padEnd(30)} ${status}`);
  });
  
  const passedCount = tests.filter(t => t.passed).length;
  const totalCount = tests.length;
  const percentage = Math.round((passedCount / totalCount) * 100);
  
  console.log('═'.repeat(60));
  console.log(`\n🎯 Results: ${passedCount}/${totalCount} tests passed (${percentage}%)`);
  
  if (passedCount === totalCount) {
    console.log('✨ ALL TESTS PASSED! Backend is working perfectly! ✨');
  } else {
    console.log('⚠️  Some tests failed. Check the logs above for details.');
  }
  
  console.log(`\n⏰ Finished: ${new Date().toLocaleString('pl-PL')}`);
  console.log('═'.repeat(60));
  
  // Exit code
  process.exit(passedCount === totalCount ? 0 : 1);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run tests
runAllTests().catch(error => {
  console.error('\n💥 Unexpected error running tests:', error);
  process.exit(1);
});
