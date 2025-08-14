import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Add, Schedule } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const FollowUpListPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Follow-up Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Schedule and track patient follow-up appointments and progress
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/follow-up/new')}
          sx={{ height: 'fit-content' }}
        >
          Schedule Follow-up
        </Button>
      </Box>

      {/* Content */}
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <Schedule sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Follow-up Appointment System
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Comprehensive follow-up management system for tracking patient progress,
            scheduling appointments, and monitoring treatment outcomes.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => navigate('/follow-up/new')}
          >
            Schedule First Follow-up
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FollowUpListPage;
