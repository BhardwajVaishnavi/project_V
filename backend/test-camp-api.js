const axios = require('axios');

async function testCampAPI() {
  try {
    console.log('🔍 Testing Camp API endpoints...\n');

    // Test login first
    console.log('1. Testing login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'doctor@medical.com',
      password: 'doctor123'
    });

    if (!loginResponse.data.success) {
      console.log('❌ Login failed');
      return;
    }

    const token = loginResponse.data.data.token;
    console.log('✅ Login successful');

    // Test camps endpoint
    console.log('\n2. Testing camps endpoint...');
    const campsResponse = await axios.get('http://localhost:5000/api/camps', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (campsResponse.data.success) {
      console.log('✅ Camps endpoint working');
      console.log(`📊 Number of camps: ${campsResponse.data.data.camps.length}`);
      
      if (campsResponse.data.data.camps.length > 0) {
        const firstCamp = campsResponse.data.data.camps[0];
        console.log(`📋 First camp: ${firstCamp.name}`);
        console.log(`📍 Venue: ${firstCamp.venue}`);
        console.log(`📅 Date: ${new Date(firstCamp.date).toLocaleDateString()}`);
        console.log(`👥 Registrations: ${firstCamp.currentRegistrations}/${firstCamp.maxCapacity || '∞'}`);
      }
    } else {
      console.log('❌ Camps endpoint failed');
    }

    // Test camp registrations endpoint
    console.log('\n3. Testing camp registrations endpoint...');
    const registrationsResponse = await axios.get('http://localhost:5000/api/camp-registrations');

    if (registrationsResponse.data.success) {
      console.log('✅ Camp registrations endpoint working');
      console.log(`📊 Number of registrations: ${registrationsResponse.data.data.registrations.length}`);
      
      if (registrationsResponse.data.data.registrations.length > 0) {
        const firstReg = registrationsResponse.data.data.registrations[0];
        console.log(`👤 First registration: ${firstReg.fullName}`);
        console.log(`🏥 Services: ${firstReg.selectedServices.join(', ')}`);
        console.log(`💰 Amount: ₹${firstReg.totalAmount}`);
        console.log(`📱 Mobile: ${firstReg.mobileNumber}`);
      }
    } else {
      console.log('❌ Camp registrations endpoint failed');
    }

    console.log('\n🎉 All Camp API tests completed successfully!');
    console.log('\n📋 Available endpoints:');
    console.log('• GET /api/camps - List all camps');
    console.log('• POST /api/camps - Create new camp');
    console.log('• GET /api/camps/:id - Get camp details');
    console.log('• PUT /api/camps/:id - Update camp');
    console.log('• DELETE /api/camps/:id - Delete camp');
    console.log('• GET /api/camp-registrations - List registrations');
    console.log('• POST /api/camp-registrations - Create registration');
    console.log('• GET /api/camp-registrations/:id - Get registration details');

  } catch (error) {
    console.error('❌ Camp API test failed:', error.message);
    if (error.response) {
      console.error('📋 Error details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    console.error('💡 Make sure the backend server is running on port 5000');
  }
}

testCampAPI();
