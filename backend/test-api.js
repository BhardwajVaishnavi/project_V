const axios = require('axios');

async function testAPI() {
  try {
    console.log('🔍 Testing API endpoints...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Health endpoint working:', healthResponse.data);

    // Test patients endpoint (without auth)
    console.log('\n2. Testing patients endpoint...');
    try {
      const patientsResponse = await axios.get('http://localhost:5000/api/patients');
      console.log('✅ Patients endpoint working:', patientsResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('⚠️  Patients endpoint requires authentication (expected)');
      } else {
        console.log('❌ Patients endpoint error:', error.message);
      }
    }

    // Test login endpoint
    console.log('\n3. Testing login endpoint...');
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'doctor@medical.com',
        password: 'doctor123'
      });
      console.log('✅ Login successful:', loginResponse.data.success);
      
      if (loginResponse.data.success) {
        const token = loginResponse.data.data.token;
        
        // Test authenticated patients endpoint
        console.log('\n4. Testing authenticated patients endpoint...');
        const authPatientsResponse = await axios.get('http://localhost:5000/api/patients', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Authenticated patients endpoint working');
        console.log('📊 Number of patients:', authPatientsResponse.data.data.patients.length);
        console.log('📋 First patient:', authPatientsResponse.data.data.patients[0]?.firstName || 'No patients found');
      }
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.error('💡 Make sure the backend server is running on port 5000');
  }
}

testAPI();
