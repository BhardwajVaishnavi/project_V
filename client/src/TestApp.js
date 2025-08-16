import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Home } from '@mui/icons-material';

function TestApp() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        🏥 Medical Patient Management System
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Frontend build test - if you can see this, the build is working!
      </Typography>
      <Button 
        variant="contained" 
        startIcon={<Home />}
        onClick={() => alert('Frontend is working!')}
      >
        Test Button
      </Button>
    </Box>
  );
}

export default TestApp;
