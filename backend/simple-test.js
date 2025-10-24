const axios = require('axios');

async function testAPI() {
  console.log('🧪 Testing Camp API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing server health...');
    const health = await axios.get('http://localhost:5000/health');
    console.log('✅ Server is healthy');
    console.log(`📊 Uptime: ${health.data.uptime} seconds\n`);

    // Test 2: Login
    console.log('2️⃣ Testing login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'doctor@medical.com',
      password: 'doctor123'
    });

    if (loginResponse.data.success) {
      console.log('✅ Login successful');
      const token = loginResponse.data.data.token;
      console.log(`🔑 Token: ${token.substring(0, 20)}...\n`);

      // Test 3: Get Camps
      console.log('3️⃣ Testing get camps...');
      const campsResponse = await axios.get('http://localhost:5000/api/camps', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (campsResponse.data.success) {
        console.log('✅ Get camps successful');
        console.log(`📊 Found ${campsResponse.data.data.camps.length} camps\n`);

        // Test 4: Create Camp
        console.log('4️⃣ Testing create camp...');
        const campData = {
          name: 'Node.js Test Camp',
          venue: 'Test Venue Node.js',
          date: '2025-08-17T07:00:00.000Z',
          startTime: '07:00',
          endTime: '13:00',
          description: 'Test camp created via Node.js',
          maxCapacity: 80
        };

        const createResponse = await axios.post('http://localhost:5000/api/camps', campData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (createResponse.data.success) {
          console.log('✅ Create camp successful');
          console.log(`📋 Created camp: ${createResponse.data.data.name}`);
          console.log(`🆔 Camp ID: ${createResponse.data.data.id}`);
        } else {
          console.log('❌ Create camp failed:', createResponse.data.message);
        }
      } else {
        console.log('❌ Get camps failed:', campsResponse.data.message);
      }
    } else {
      console.log('❌ Login failed:', loginResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('📋 Response status:', error.response.status);
      console.error('📋 Response data:', error.response.data);
    }
  }

  console.log('\n🏁 API tests completed!');
}

testAPI();
