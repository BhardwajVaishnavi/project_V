import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Grid,
  Divider
} from '@mui/material';
import authService from '../../services/authService';
import toast from 'react-hot-toast';

const LoginTestPage = () => {
  const [credentials, setCredentials] = useState({
    email: 'doctor@medical.com',
    password: 'doctor123'
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const addResult = (message, type = 'info') => {
    setResults(prev => [...prev, {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const handleInputChange = (field, value) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const testLogin = async () => {
    setLoading(true);
    addResult('🔐 Starting login test...', 'info');

    try {
      console.log('🔐 Testing login with credentials:', credentials);
      
      const response = await authService.login(credentials);
      
      console.log('🔐 Login response received:', response);
      
      if (response.success) {
        addResult(`✅ Login successful! Welcome ${response.data.user.firstName}`, 'success');
        toast.success('Login successful!');
        
        // Check what was stored
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        addResult(`📦 Stored user: ${storedUser ? 'Yes' : 'No'}`, 'info');
        addResult(`🔑 Stored token: ${storedToken ? 'Yes' : 'No'}`, 'info');
        
        if (storedToken) {
          addResult(`🔑 Token preview: ${storedToken.substring(0, 30)}...`, 'info');
        }
      } else {
        addResult(`❌ Login failed: ${response.message}`, 'error');
        toast.error(`Login failed: ${response.message}`);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      let errorMessage = 'Unknown error';
      
      if (error.response) {
        errorMessage = error.response.data?.message || `HTTP ${error.response.status}`;
        addResult(`❌ Login failed: ${errorMessage}`, 'error');
        addResult(`📋 Status: ${error.response.status}`, 'error');
        addResult(`📋 Response: ${JSON.stringify(error.response.data)}`, 'error');
      } else if (error.request) {
        errorMessage = 'No response from server';
        addResult(`❌ Login failed: ${errorMessage}`, 'error');
        addResult(`📋 Check if backend is running on port 5000`, 'error');
      } else {
        errorMessage = error.message;
        addResult(`❌ Login failed: ${errorMessage}`, 'error');
      }
      
      toast.error(`Login failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogout = () => {
    authService.logout();
    addResult('🚪 Logged out successfully', 'info');
    toast.success('Logged out');
  };

  const checkAuthStatus = () => {
    const isAuth = authService.isAuthenticated();
    const user = authService.getStoredUser();
    const token = authService.getStoredToken();
    
    addResult(`🔍 Is authenticated: ${isAuth}`, isAuth ? 'success' : 'warning');
    addResult(`👤 Stored user: ${user ? `${user.firstName} ${user.lastName}` : 'None'}`, 'info');
    addResult(`🔑 Has token: ${!!token}`, !!token ? 'success' : 'warning');
  };

  const clearResults = () => {
    setResults([]);
  };

  const testDirectAPI = async () => {
    setLoading(true);
    addResult('🌐 Testing direct API call...', 'info');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      addResult(`📡 Direct API Status: ${response.status}`, response.ok ? 'success' : 'error');
      addResult(`📡 Direct API Response: ${JSON.stringify(data)}`, 'info');
      
      if (response.ok && data.success) {
        addResult('✅ Direct API login successful!', 'success');
      } else {
        addResult(`❌ Direct API login failed: ${data.message}`, 'error');
      }
    } catch (error) {
      addResult(`❌ Direct API error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🔐 Login Test Page
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Use this page to test and debug login functionality.
      </Typography>

      {/* Login Form */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Login Credentials
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={credentials.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={credentials.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Test Buttons */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Actions
          </Typography>
          
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button 
              variant="contained" 
              onClick={testLogin}
              disabled={loading}
            >
              🔐 Test Login (AuthService)
            </Button>
            <Button 
              variant="outlined" 
              onClick={testDirectAPI}
              disabled={loading}
            >
              🌐 Test Direct API
            </Button>
            <Button 
              variant="outlined" 
              onClick={checkAuthStatus}
              disabled={loading}
            >
              🔍 Check Auth Status
            </Button>
            <Button 
              variant="outlined" 
              onClick={testLogout}
              disabled={loading}
            >
              🚪 Logout
            </Button>
            <Button 
              variant="text" 
              onClick={clearResults}
            >
              🗑️ Clear Results
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Results
          </Typography>
          
          {results.length === 0 ? (
            <Alert severity="info">
              No test results yet. Click a test button above to start testing.
            </Alert>
          ) : (
            <Box>
              {results.map((result) => (
                <Alert 
                  key={result.id} 
                  severity={result.type} 
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2">
                    <strong>[{result.timestamp}]</strong> {result.message}
                  </Typography>
                </Alert>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      {/* Debug Info */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Debug Information
          </Typography>
          
          <Typography variant="body2" component="div">
            <strong>Backend URL:</strong> {process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}<br/>
            <strong>Current URL:</strong> {window.location.href}<br/>
            <strong>Local Storage Token:</strong> {localStorage.getItem('token') ? 'Present' : 'Not found'}<br/>
            <strong>Local Storage User:</strong> {localStorage.getItem('user') ? 'Present' : 'Not found'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginTestPage;
