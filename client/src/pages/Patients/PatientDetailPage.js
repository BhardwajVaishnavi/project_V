import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Divider,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import { Edit, Person, ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import { getPatientById } from '../../store/slices/patientSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const PatientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPatient, isLoading } = useSelector((state) => state.patients);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(getPatientById(id));
    }
  }, [dispatch, id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LoadingSpinner />
      </Box>
    );
  }

  if (!currentPatient) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6">Patient not found</Typography>
        <Button onClick={() => navigate('/patients')} sx={{ mt: 2 }}>
          Back to Patients
        </Button>
      </Box>
    );
  }

  const patient = currentPatient;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/patients')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            {patient.firstName} {patient.lastName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Patient ID: {patient.patientId}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => navigate(`/patients/${patient.id}/edit`)}
        >
          Edit Patient
        </Button>
      </Box>

      {/* Patient Overview */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                  }}
                  src={patient.profilePhotoUrl}
                >
                  <Person sx={{ fontSize: '3rem' }} />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  {patient.firstName} {patient.lastName}
                </Typography>
                <Chip
                  label={patient.sex}
                  color={patient.sex === 'MALE' ? 'primary' : 'secondary'}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Age
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {patient.age} years
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Mobile
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {patient.mobile}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {patient.email || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Aadhar Number
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {patient.aadharNumber || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {[patient.houseVillage, patient.post, patient.city, patient.state]
                      .filter(Boolean)
                      .join(', ') || 'Not provided'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Medical Information" />
          <Tab label="Investigations" />
          <Tab label="Treatments" />
          <Tab label="Documents" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Medical Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Primary Disease
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {patient.primaryDisease || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Height / Weight / BMI
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {patient.height ? `${patient.height} cm` : 'N/A'} / {patient.weight ? `${patient.weight} kg` : 'N/A'} / {patient.bmi || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Investigations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Investigation records will be displayed here.
            </Typography>
          </CardContent>
        </Card>
      )}

      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Treatments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Treatment records will be displayed here.
            </Typography>
          </CardContent>
        </Card>
      )}

      {tabValue === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Documents
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Patient documents will be displayed here.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PatientDetailPage;
