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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Edit, Person, ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { format } from 'date-fns';

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
          <Tab label="Surgeries" />
          <Tab label="Follow-ups" />
          <Tab label="Comorbidities" />
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
                  Blood Group
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {patient.bloodGroup || 'Not specified'}
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
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  MELD Score
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {patient.meldScore || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Transplant Type
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {patient.transplantType || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date of Visit
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {patient.dateOfVisit ? format(new Date(patient.dateOfVisit), 'MMM dd, yyyy') : 'Not specified'}
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
            {patient.investigations && patient.investigations.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Investigation Type</TableCell>
                      <TableCell>Result</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patient.investigations.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell>{inv.investigationType || 'N/A'}</TableCell>
                        <TableCell>{inv.result || 'N/A'}</TableCell>
                        <TableCell>{inv.createdAt ? format(new Date(inv.createdAt), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No investigations recorded yet.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Treatments
            </Typography>
            {patient.treatments && patient.treatments.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Final Diagnosis</TableCell>
                      <TableCell>Treatment Plan</TableCell>
                      <TableCell>Primary Treatment</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patient.treatments.map((treatment) => (
                      <TableRow key={treatment.id}>
                        <TableCell>{treatment.finalDiagnosis || 'N/A'}</TableCell>
                        <TableCell>{treatment.treatmentPlan || 'N/A'}</TableCell>
                        <TableCell>{treatment.primaryTreatmentPlan || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No treatments recorded yet.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {tabValue === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Surgeries
            </Typography>
            {patient.surgeries && patient.surgeries.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Surgery Name</TableCell>
                      <TableCell>Date of Surgery</TableCell>
                      <TableCell>Next Follow-up</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patient.surgeries.map((surgery) => (
                      <TableRow key={surgery.id}>
                        <TableCell>{surgery.nameOfSurgery || 'N/A'}</TableCell>
                        <TableCell>{surgery.dateOfSurgery ? format(new Date(surgery.dateOfSurgery), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                        <TableCell>{surgery.nextFollowUp ? format(new Date(surgery.nextFollowUp), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No surgeries recorded yet.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {tabValue === 4 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Follow-ups
            </Typography>
            {patient.followUps && patient.followUps.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Follow-up Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patient.followUps.map((followUp) => (
                      <TableRow key={followUp.id}>
                        <TableCell>{followUp.followUpDate ? format(new Date(followUp.followUpDate), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                        <TableCell>
                          <Chip
                            label={followUp.status || 'Pending'}
                            size="small"
                            color={followUp.status === 'COMPLETED' ? 'success' : 'warning'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No follow-ups scheduled yet.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {tabValue === 5 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Comorbidities
            </Typography>
            {patient.comorbidities && patient.comorbidities.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {patient.comorbidities.map((comorbidity) => (
                  <Chip
                    key={comorbidity.id}
                    label={comorbidity.comorbidityName || 'Unknown'}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No comorbidities recorded yet.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {tabValue === 6 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Documents
            </Typography>
            {patient.documents && patient.documents.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Document Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Upload Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patient.documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.documentName || 'N/A'}</TableCell>
                        <TableCell>{doc.documentType || 'N/A'}</TableCell>
                        <TableCell>{doc.createdAt ? format(new Date(doc.createdAt), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No documents uploaded yet.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PatientDetailPage;
