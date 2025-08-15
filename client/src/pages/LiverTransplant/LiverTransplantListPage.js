import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Add, Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LiverTransplantListPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Liver Transplant Evaluations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive liver transplant evaluation and assessment management
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/liver-transplant/new')}
          sx={{ height: 'fit-content' }}
        >
          New Evaluation
        </Button>
      </Box>

      {/* Content */}
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <Favorite sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Liver Transplant Evaluation Center
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Comprehensive evaluation system for liver transplant candidates including
            blood investigations, viral markers, physical assessments, and medical clearances.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => navigate('/liver-transplant/new')}
          >
            Start New Evaluation
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LiverTransplantListPage;
