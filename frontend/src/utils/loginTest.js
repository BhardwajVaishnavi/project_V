// Complete login test utility
import authService from '../services/authService';

export const runCompleteLoginTest = async () => {
  console.log('🧪 Running Complete Login Test...\n');

  const results = [];
  
  const addResult = (test, status, message) => {
    const result = { test, status, message, timestamp: new Date().toISOString() };
    results.push(result);
    console.log(`${status === 'success' ? '✅' : status === 'error' ? '❌' : 'ℹ️'} ${test}: ${message}`);
    return result;
  };

  try {
    // Step 1: Clear any existing auth
    addResult('Clear Auth', 'info', 'Clearing existing authentication');
    authService.logout();

    // Step 2: Check initial auth status
    const initialAuth = authService.isAuthenticated();
    addResult('Initial Auth Check', initialAuth ? 'warning' : 'success', 
      initialAuth ? 'Already authenticated' : 'Not authenticated (expected)');

    // Step 3: Test backend connectivity
    addResult('Backend Test', 'info', 'Testing backend connectivity...');
    try {
      const healthResponse = await fetch('http://localhost:5000/health');
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        addResult('Backend Health', 'success', `Server running (uptime: ${Math.floor(healthData.uptime)}s)`);
      } else {
        addResult('Backend Health', 'error', `Server responded with status ${healthResponse.status}`);
        return results;
      }
    } catch (error) {
      addResult('Backend Health', 'error', `Cannot connect to backend: ${error.message}`);
      return results;
    }

    // Step 4: Test direct API login
    addResult('Direct API Login', 'info', 'Testing direct API login...');
    try {
      const directResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'doctor@medical.com',
          password: 'doctor123'
        })
      });

      const directData = await directResponse.json();
      
      if (directResponse.ok && directData.success) {
        addResult('Direct API Login', 'success', `Login successful for ${directData.data.user.firstName}`);
      } else {
        addResult('Direct API Login', 'error', `Login failed: ${directData.message}`);
        return results;
      }
    } catch (error) {
      addResult('Direct API Login', 'error', `API error: ${error.message}`);
      return results;
    }

    // Step 5: Test auth service login
    addResult('Auth Service Login', 'info', 'Testing auth service login...');
    try {
      const authResponse = await authService.login({
        email: 'doctor@medical.com',
        password: 'doctor123'
      });

      if (authResponse.success) {
        addResult('Auth Service Login', 'success', `Login successful for ${authResponse.data.user.firstName}`);
        
        // Step 6: Check stored credentials
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        addResult('Storage Check', storedUser && storedToken ? 'success' : 'error',
          `User: ${storedUser ? 'Stored' : 'Missing'}, Token: ${storedToken ? 'Stored' : 'Missing'}`);

        // Step 7: Check auth service status
        const authStatus = authService.isAuthenticated();
        addResult('Auth Status Check', authStatus ? 'success' : 'error',
          authStatus ? 'Authenticated' : 'Not authenticated');

        // Step 8: Test authenticated API call
        addResult('Authenticated API Test', 'info', 'Testing authenticated API call...');
        try {
          const campsResponse = await fetch('http://localhost:5000/api/camps', {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (campsResponse.ok) {
            const campsData = await campsResponse.json();
            addResult('Authenticated API Test', 'success', 
              `API call successful, found ${campsData.data?.camps?.length || 0} camps`);
          } else {
            addResult('Authenticated API Test', 'error', 
              `API call failed with status ${campsResponse.status}`);
          }
        } catch (error) {
          addResult('Authenticated API Test', 'error', `API call error: ${error.message}`);
        }

      } else {
        addResult('Auth Service Login', 'error', `Login failed: ${authResponse.message}`);
      }
    } catch (error) {
      addResult('Auth Service Login', 'error', `Auth service error: ${error.message}`);
    }

    // Summary
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    addResult('Test Summary', errorCount === 0 ? 'success' : 'warning',
      `${successCount} passed, ${errorCount} failed out of ${results.length} tests`);

  } catch (error) {
    addResult('Test Suite Error', 'error', `Unexpected error: ${error.message}`);
  }

  console.log('\n🏁 Complete Login Test Finished');
  return results;
};

export const displayTestResults = (results) => {
  console.table(results.map(r => ({
    Test: r.test,
    Status: r.status,
    Message: r.message
  })));
};

// Quick test function for browser console
window.testLogin = async () => {
  const results = await runCompleteLoginTest();
  displayTestResults(results);
  return results;
};
