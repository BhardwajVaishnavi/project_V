const http = require('http');

// Test if server is running
function testServerHealth() {
  return new Promise((resolve, reject) => {
    const req = http.get('http://localhost:5000/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Test login
function testLogin() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: 'doctor@medical.com',
      password: 'doctor123'
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

// Test camps endpoint
function testCamps(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/camps',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

// Test camp creation
function testCreateCamp(token) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      name: 'Test Camp API',
      venue: 'Test Venue API',
      date: '2025-08-17T07:00:00.000Z',
      startTime: '07:00',
      endTime: '13:00',
      description: 'Test camp created via direct API test',
      maxCapacity: 50
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/camps',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

// Run all tests
async function runTests() {
  console.log('🧪 Starting Direct API Tests...\n');

  try {
    // Test 1: Server Health
    console.log('1️⃣ Testing server health...');
    try {
      const health = await testServerHealth();
      console.log(`✅ Server is running (Status: ${health.status})`);
      console.log(`📊 Health data:`, health.data);
    } catch (error) {
      console.log(`❌ Server health check failed: ${error.message}`);
      console.log('💡 Make sure backend server is running: cd backend && node server.js');
      return;
    }

    // Test 2: Login
    console.log('\n2️⃣ Testing login...');
    try {
      const login = await testLogin();
      if (login.status === 200 && login.data.success) {
        console.log('✅ Login successful');
        const token = login.data.data.token;
        console.log(`🔑 Token received: ${token.substring(0, 20)}...`);

        // Test 3: Get Camps
        console.log('\n3️⃣ Testing get camps...');
        try {
          const camps = await testCamps(token);
          if (camps.status === 200) {
            console.log('✅ Get camps successful');
            console.log(`📊 Found ${camps.data.data?.camps?.length || 0} camps`);
          } else {
            console.log(`❌ Get camps failed (Status: ${camps.status})`);
            console.log('📋 Response:', camps.data);
          }
        } catch (error) {
          console.log(`❌ Get camps error: ${error.message}`);
        }

        // Test 4: Create Camp
        console.log('\n4️⃣ Testing create camp...');
        try {
          const create = await testCreateCamp(token);
          if (create.status === 201) {
            console.log('✅ Create camp successful');
            console.log(`📋 Created camp: ${create.data.data?.name}`);
          } else {
            console.log(`❌ Create camp failed (Status: ${create.status})`);
            console.log('📋 Response:', create.data);
          }
        } catch (error) {
          console.log(`❌ Create camp error: ${error.message}`);
        }

      } else {
        console.log(`❌ Login failed (Status: ${login.status})`);
        console.log('📋 Response:', login.data);
      }
    } catch (error) {
      console.log(`❌ Login error: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }

  console.log('\n🏁 Direct API tests completed!');
}

runTests();
