const http = require('http');

function testLogin(email, password) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email: email,
      password: password
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

    console.log(`🔐 Testing login for: ${email}`);

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

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

async function runLoginTests() {
  console.log('🧪 Testing Login API...\n');

  try {
    // Test doctor login
    console.log('1️⃣ Testing doctor login...');
    const doctorLogin = await testLogin('doctor@medical.com', 'doctor123');
    
    if (doctorLogin.status === 200 && doctorLogin.data.success) {
      console.log('✅ Doctor login successful!');
      console.log(`👤 User: ${doctorLogin.data.data.user.firstName} ${doctorLogin.data.data.user.lastName}`);
      console.log(`🔑 Token: ${doctorLogin.data.data.token.substring(0, 30)}...`);
    } else {
      console.log(`❌ Doctor login failed (Status: ${doctorLogin.status})`);
      console.log('📋 Response:', doctorLogin.data);
    }

    // Test admin login
    console.log('\n2️⃣ Testing admin login...');
    const adminLogin = await testLogin('admin@medical.com', 'admin123');
    
    if (adminLogin.status === 200 && adminLogin.data.success) {
      console.log('✅ Admin login successful!');
      console.log(`👤 User: ${adminLogin.data.data.user.firstName} ${adminLogin.data.data.user.lastName}`);
      console.log(`🔑 Token: ${adminLogin.data.data.token.substring(0, 30)}...`);
    } else {
      console.log(`❌ Admin login failed (Status: ${adminLogin.status})`);
      console.log('📋 Response:', adminLogin.data);
    }

    // Test wrong password
    console.log('\n3️⃣ Testing wrong password...');
    const wrongLogin = await testLogin('doctor@medical.com', 'wrongpassword');
    
    if (wrongLogin.status === 401) {
      console.log('✅ Wrong password correctly rejected');
    } else {
      console.log(`❌ Wrong password test failed (Status: ${wrongLogin.status})`);
      console.log('📋 Response:', wrongLogin.data);
    }

  } catch (error) {
    console.error('❌ Login test failed:', error.message);
  }

  console.log('\n🏁 Login tests completed!');
}

runLoginTests();
