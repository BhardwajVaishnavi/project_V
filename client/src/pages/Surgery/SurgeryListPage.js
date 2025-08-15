import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Add, MedicalServices } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SurgeryListPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Surgery Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage surgical procedures, scheduling, and post-operative care
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/surgery/new')}
          sx={{ height: 'fit-content' }}
        >
          Schedule Surgery
        </Button>
      </Box>

      {/* Content */}
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <MedicalServices sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Surgery Management System
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Comprehensive surgery management including pre-operative assessments,
            surgical scheduling, and post-operative care tracking.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => navigate('/surgery/new')}
          >
            Schedule First Surgery
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SurgeryListPage;
