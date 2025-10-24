import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', '');

export const checkBackendHealth = async () => {
  try {
    console.log('🔍 Checking backend health...');
    console.log('🌐 Backend URL:', BASE_URL);
    
    const response = await axios.get(`${BASE_URL}/health`, {
      timeout: 5000
    });
    
    console.log('✅ Backend is healthy:', response.data);
    return { healthy: true, data: response.data };
  } catch (error) {
    console.error('❌ Backend health check failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🚫 Connection refused - backend server is not running');
      return { 
        healthy: false, 
        error: 'Backend server is not running. Please start the backend server.',
        code: 'SERVER_DOWN'
      };
    }
    
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout - backend server is slow or unresponsive');
      return { 
        healthy: false, 
        error: 'Backend server is not responding. Please check the server.',
        code: 'TIMEOUT'
      };
    }
    
    return { 
      healthy: false, 
      error: error.message,
      code: 'UNKNOWN'
    };
  }
};

export const checkAuthStatus = async () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('🔍 Checking auth status...');
    console.log('🔑 Token exists:', !!token);
    console.log('👤 User exists:', !!user);
    
    if (!token || !user) {
      console.log('❌ No token or user found in localStorage');
      return { authenticated: false, reason: 'NO_CREDENTIALS' };
    }
    
    // Try to decode token to check expiry
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      console.log('🕐 Token expires at:', new Date(tokenPayload.exp * 1000));
      console.log('🕐 Current time:', new Date(currentTime * 1000));
      
      if (tokenPayload.exp < currentTime) {
        console.log('⏰ Token has expired');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return { authenticated: false, reason: 'TOKEN_EXPIRED' };
      }
      
      console.log('✅ Token is valid');
      return { authenticated: true, user: JSON.parse(user), tokenPayload };
    } catch (decodeError) {
      console.error('❌ Failed to decode token:', decodeError);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { authenticated: false, reason: 'INVALID_TOKEN' };
    }
  } catch (error) {
    console.error('❌ Auth status check failed:', error);
    return { authenticated: false, reason: 'ERROR', error: error.message };
  }
};

export const performStartupChecks = async () => {
  console.log('🚀 Performing startup checks...');
  
  const healthCheck = await checkBackendHealth();
  const authCheck = await checkAuthStatus();
  
  console.log('📊 Startup check results:', {
    backend: healthCheck.healthy ? '✅ Healthy' : '❌ Unhealthy',
    auth: authCheck.authenticated ? '✅ Authenticated' : '❌ Not authenticated'
  });
  
  return {
    backend: healthCheck,
    auth: authCheck
  };
};
