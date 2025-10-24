/**
 * Test script for Patient Management Features
 * Tests: Add, Edit, Delete, View, and Validation
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let testPatientId = '';

// Test data
const validPatientData = {
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-05-15',
  sex: 'MALE',
  mobile: '9876543210',
  email: 'john.doe@example.com',
  aadharNumber: '123456789012',
  city: 'Mumbai',
  state: 'Maharashtra',
  houseVillage: '123 Main Street',
  post: 'Central Post',
  pincode: '400001',
  height: 175,
  weight: 70,
  primaryDisease: 'Liver Disease',
  bloodGroup: 'O+',
  meldScore: 15,
  transplantType: 'LDLT'
};

const invalidEmailData = {
  ...validPatientData,
  email: 'invalid-email'
};

const invalidAadharData = {
  ...validPatientData,
  aadharNumber: '111111111111' // All same digits
};

const invalidMobileData = {
  ...validPatientData,
  mobile: '1234567890' // Invalid format
};

// Helper function to make API calls
async function apiCall(method, endpoint, data = null, token = authToken) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
}

// Test functions
async function testLogin() {
  console.log('\n📝 Testing Login...');
  const result = await apiCall('POST', '/auth/login', {
    email: 'demo@example.com',
    password: 'demo123'
  }, '');

  if (result.success && result.data.data?.token) {
    authToken = result.data.data.token;
    console.log('✅ Login successful');
    return true;
  } else {
    console.log('❌ Login failed:', result.error);
    return false;
  }
}

async function testCreatePatient() {
  console.log('\n➕ Testing Create Patient with Valid Data...');
  const result = await apiCall('POST', '/patients', validPatientData);

  if (result.success) {
    testPatientId = result.data.data.patient.id;
    console.log('✅ Patient created successfully');
    console.log('   Patient ID:', result.data.data.patient.patientId);
    return true;
  } else {
    console.log('❌ Patient creation failed:', result.error);
    return false;
  }
}

async function testInvalidEmail() {
  console.log('\n📧 Testing Invalid Email Validation...');
  const result = await apiCall('POST', '/patients', invalidEmailData);

  if (!result.success && result.status === 400) {
    console.log('✅ Invalid email correctly rejected');
    return true;
  } else {
    console.log('❌ Invalid email validation failed');
    return false;
  }
}

async function testInvalidAadhar() {
  console.log('\n🆔 Testing Invalid Aadhar Validation...');
  const result = await apiCall('POST', '/patients', invalidAadharData);

  if (!result.success && result.status === 400) {
    console.log('✅ Invalid Aadhar correctly rejected');
    return true;
  } else {
    console.log('❌ Invalid Aadhar validation failed');
    return false;
  }
}

async function testInvalidMobile() {
  console.log('\n📱 Testing Invalid Mobile Validation...');
  const result = await apiCall('POST', '/patients', invalidMobileData);

  if (!result.success && result.status === 400) {
    console.log('✅ Invalid mobile correctly rejected');
    return true;
  } else {
    console.log('❌ Invalid mobile validation failed');
    return false;
  }
}

async function testGetPatient() {
  console.log('\n👁️ Testing Get Patient Details...');
  const result = await apiCall('GET', `/patients/${testPatientId}`);

  if (result.success && result.data.data.patient) {
    console.log('✅ Patient details retrieved successfully');
    console.log('   Name:', result.data.data.patient.firstName, result.data.data.patient.lastName);
    return true;
  } else {
    console.log('❌ Get patient failed:', result.error);
    return false;
  }
}

async function testUpdatePatient() {
  console.log('\n✏️ Testing Update Patient...');
  const updateData = {
    ...validPatientData,
    primaryDisease: 'Updated Liver Disease'
  };

  const result = await apiCall('PUT', `/patients/${testPatientId}`, updateData);

  if (result.success) {
    console.log('✅ Patient updated successfully');
    return true;
  } else {
    console.log('❌ Patient update failed:', result.error);
    return false;
  }
}

async function testDeletePatient() {
  console.log('\n🗑️ Testing Delete Patient...');
  const result = await apiCall('DELETE', `/patients/${testPatientId}`);

  if (result.success) {
    console.log('✅ Patient deleted successfully');
    return true;
  } else {
    console.log('❌ Patient delete failed:', result.error);
    return false;
  }
}

async function testGetPatients() {
  console.log('\n📋 Testing Get All Patients...');
  const result = await apiCall('GET', '/patients?page=1&limit=10');

  if (result.success && result.data.data.patients) {
    console.log('✅ Patients list retrieved successfully');
    console.log('   Total patients:', result.data.data.pagination.totalCount);
    return true;
  } else {
    console.log('❌ Get patients failed:', result.error);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🧪 Starting Patient Management Feature Tests...\n');
  console.log('=' .repeat(50));

  const tests = [
    { name: 'Login', fn: testLogin },
    { name: 'Create Patient', fn: testCreatePatient },
    { name: 'Invalid Email', fn: testInvalidEmail },
    { name: 'Invalid Aadhar', fn: testInvalidAadhar },
    { name: 'Invalid Mobile', fn: testInvalidMobile },
    { name: 'Get Patient', fn: testGetPatient },
    { name: 'Update Patient', fn: testUpdatePatient },
    { name: 'Get All Patients', fn: testGetPatients },
    { name: 'Delete Patient', fn: testDeletePatient }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} error:`, error.message);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  console.log(`✅ Success Rate: ${((passed / tests.length) * 100).toFixed(2)}%\n`);

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});

