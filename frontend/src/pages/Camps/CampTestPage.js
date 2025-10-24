import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import campService from '../../services/campService';
import authService from '../../services/authService';

const CampTestPage = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const isAuth = authService.isAuthenticated();
    const user = authService.getStoredUser();
    const token = authService.getStoredToken();
    
    setAuthStatus({
      isAuthenticated: isAuth,
      user: user,
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'No token'
    });
    
    addResult('🔍 Auth Check', isAuth ? 'Authenticated' : 'Not authenticated', isAuth ? 'success' : 'error');
  };

  const addResult = (test, message, type = 'info') => {
    setResults(prev => [...prev, {
      id: Date.now(),
      test,
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testGetCamps = async () => {
    setLoading(true);
    addResult('📋 Get Camps', 'Starting test...', 'info');
    
    try {
      const response = await campService.getCamps();
      addResult('📋 Get Camps', `Success! Found ${response.camps.length} camps`, 'success');
      console.log('Get camps response:', response);
    } catch (error) {
      addResult('📋 Get Camps', `Failed: ${error.message}`, 'error');
      console.error('Get camps error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testCreateCamp = async () => {
    setLoading(true);
    addResult('➕ Create Camp', 'Starting test...', 'info');
    
    const testCampData = {
      name: 'Frontend Test Camp ' + Date.now(),
      venue: 'Frontend Test Venue',
      date: '2025-08-17T07:00:00.000Z',
      startTime: '07:00',
      endTime: '13:00',
      description: 'Test camp created from frontend test page',
      maxCapacity: 60
    };

    try {
      console.log('Creating camp with data:', testCampData);
      const response = await campService.createCamp(testCampData);
      addResult('➕ Create Camp', `Success! Created camp: ${response.data.name}`, 'success');
      console.log('Create camp response:', response);
    } catch (error) {
      addResult('➕ Create Camp', `Failed: ${error.message}`, 'error');
      console.error('Create camp error:', error);
      
      if (error.response) {
        addResult('➕ Create Camp Details', `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    addResult('🔐 Login Test', 'Starting login...', 'info');
    
    try {
      const response = await authService.login({
        email: 'doctor@medical.com',
        password: 'doctor123'
      });
      
      addResult('🔐 Login Test', `Success! Logged in as ${response.user.firstName}`, 'success');
      checkAuth(); // Refresh auth status
    } catch (error) {
      addResult('🔐 Login Test', `Failed: ${error.message}`, 'error');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  const clearAuth = () => {
    authService.logout();
    checkAuth();
    addResult('🚪 Logout', 'Cleared authentication', 'info');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🧪 Camp API Test Page
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Use this page to test camp API functionality and debug issues.
      </Typography>

      {/* Auth Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🔐 Authentication Status
          </Typography>
          {authStatus && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Alert severity={authStatus.isAuthenticated ? 'success' : 'warning'}>
                  Status: {authStatus.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                </Alert>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">
                  <strong>User:</strong> {authStatus.user ? `${authStatus.user.firstName} ${authStatus.user.lastName}` : 'None'}<br/>
                  <strong>Token:</strong> {authStatus.tokenPreview}
                </Typography>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Test Buttons */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🧪 Test Actions
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button 
              variant="contained" 
              onClick={testLogin}
              disabled={loading}
            >
              🔐 Test Login
            </Button>
            <Button 
              variant="contained" 
              onClick={testGetCamps}
              disabled={loading}
            >
              📋 Test Get Camps
            </Button>
            <Button 
              variant="contained" 
              onClick={testCreateCamp}
              disabled={loading}
            >
              ➕ Test Create Camp
            </Button>
            <Button 
              variant="outlined" 
              onClick={clearAuth}
              disabled={loading}
            >
              🚪 Clear Auth
            </Button>
            <Button 
              variant="outlined" 
              onClick={clearResults}
              disabled={loading}
            >
              🗑️ Clear Results
            </Button>
          </Box>
          
          {loading && (
            <Box display="flex" alignItems="center" gap={1} mt={2}>
              <CircularProgress size={20} />
              <Typography variant="body2">Running test...</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Test Results
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
                    <strong>[{result.timestamp}] {result.test}:</strong> {result.message}
                  </Typography>
                </Alert>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CampTestPage;
