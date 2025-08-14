import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Add, LocalHospital } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TreatmentListPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Treatments
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage patient treatment plans and medications
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/treatments/new')}
          sx={{ height: 'fit-content' }}
        >
          New Treatment
        </Button>
      </Box>

      {/* Content */}
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <LocalHospital sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Treatment Management
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Treatment list and management features will be implemented here.
            This will include medication tracking, treatment plans, and progress monitoring.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => navigate('/treatments/new')}
          >
            Create First Treatment Plan
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TreatmentListPage;
