const http = require('http');

function makeRequest(path, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
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

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

function login() {
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

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function testPatientAPI() {
  console.log('🧪 Testing Updated Patient API...\n');

  try {
    // Step 1: Login
    console.log('1️⃣ Logging in...');
    const loginResponse = await login();
    
    if (loginResponse.status !== 200 || !loginResponse.data.success) {
      console.log('❌ Login failed');
      return;
    }

    const token = loginResponse.data.data.token;
    console.log('✅ Login successful\n');

    // Step 2: Get patients
    console.log('2️⃣ Fetching patients...');
    const patientsResponse = await makeRequest('/api/patients', token);
    
    if (patientsResponse.status !== 200 || !patientsResponse.data.success) {
      console.log('❌ Failed to fetch patients');
      console.log('Response:', patientsResponse.data);
      return;
    }

    const patients = patientsResponse.data.data.patients;
    console.log(`✅ Fetched ${patients.length} patients\n`);

    // Step 3: Display patient information
    console.log('📊 Patient Information with New Fields:');
    console.log('='.repeat(120));
    
    patients.forEach((patient, index) => {
      console.log(`${index + 1}. ${patient.patientId}: ${patient.firstName} ${patient.lastName}`);
      console.log(`   Age: ${patient.dateOfBirth ? Math.floor((new Date() - new Date(patient.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)) : 'N/A'} | Sex: ${patient.sex} | Mobile: ${patient.mobile}`);
      console.log(`   City: ${patient.city || 'N/A'} | Blood Group: ${patient.bloodGroup || 'N/A'} | MELD Score: ${patient.meldScore || 'N/A'}`);
      console.log(`   Transplant Type: ${patient.transplantType || 'N/A'}`);
      
      // Surgery information
      if (patient.surgeries && patient.surgeries.length > 0) {
        const latestSurgery = patient.surgeries[0];
        console.log(`   Latest Surgery: ${latestSurgery.nameOfSurgery || 'N/A'} on ${latestSurgery.dateOfSurgery ? new Date(latestSurgery.dateOfSurgery).toLocaleDateString() : 'Not scheduled'}`);
        console.log(`   Next Follow-up: ${latestSurgery.nextFollowUp ? new Date(latestSurgery.nextFollowUp).toLocaleDateString() : 'Not scheduled'}`);
      } else {
        console.log(`   Surgery: No surgeries recorded`);
      }
      
      // Follow-up information
      if (patient.followUps && patient.followUps.length > 0) {
        const nextFollowUp = patient.followUps[0];
        console.log(`   Upcoming Follow-up: ${new Date(nextFollowUp.followUpDate).toLocaleDateString()}`);
      } else {
        console.log(`   Follow-up: No upcoming follow-ups`);
      }
      
      console.log('');
    });

    console.log('🎉 Patient API test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPatientAPI();
