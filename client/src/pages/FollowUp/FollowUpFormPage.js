import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  MenuItem,
  Divider,
  Alert,
  Autocomplete,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Save,
  ArrowBack,
  Schedule,
  Person,
  Assignment,
  LocalHospital,
  ExpandMore,
  CloudUpload,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import toast from 'react-hot-toast';

import { getSearchSuggestions } from '../../store/slices/patientSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

// Validation schema
const schema = yup.object({
  patientId: yup.string().required('Patient selection is required'),
  followUpDate: yup.date().required('Follow-up date is required'),
  status: yup.string().required('Status is required'),
  finalBiopsy: yup.string().nullable(),
  stageOfDisease: yup.string().nullable(),
  chemotherapyDetails: yup.string().nullable(),
  radiotherapyDetails: yup.string().nullable(),
  nextFollowUpDate: yup.date().nullable(),
  notes: yup.string().nullable(),
});

const followUpStatuses = [
  { value: 'SCHEDULED', label: 'Scheduled', color: 'info' },
  { value: 'COMPLETED', label: 'Completed', color: 'success' },
  { value: 'MISSED', label: 'Missed', color: 'warning' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'error' },
  { value: 'RESCHEDULED', label: 'Rescheduled', color: 'primary' },
];

const diseaseStages = [
  { value: 'STAGE_0', label: 'Stage 0 (In Situ)' },
  { value: 'STAGE_I', label: 'Stage I (Early)' },
  { value: 'STAGE_II', label: 'Stage II (Localized)' },
  { value: 'STAGE_III', label: 'Stage III (Regional)' },
  { value: 'STAGE_IV', label: 'Stage IV (Distant)' },
  { value: 'REMISSION', label: 'Remission' },
  { value: 'RECURRENCE', label: 'Recurrence' },
];

const FollowUpFormPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      patientId: '',
      followUpDate: new Date(),
      status: 'SCHEDULED',
      finalBiopsy: '',
      stageOfDisease: '',
      chemotherapyDetails: '',
      radiotherapyDetails: '',
      nextFollowUpDate: null,
      notes: '',
    },
  });

  const selectedStatus = watch('status');

  const handlePatientSearch = async (searchTerm) => {
    if (searchTerm.length >= 2) {
      try {
        const response = await dispatch(getSearchSuggestions(searchTerm));
        setSearchSuggestions(response.payload || []);
      } catch (error) {
        console.error('Error searching patients:', error);
      }
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setValue('patientId', patient.id);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      console.log('Follow-up data:', data);
      toast.success(isEdit ? 'Follow-up updated successfully!' : 'Follow-up scheduled successfully!');
      navigate('/follow-up');
    } catch (error) {
      console.error('Error saving follow-up:', error);
      toast.error('Failed to save follow-up');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusOption = followUpStatuses.find(option => option.value === status);
    return statusOption ? statusOption.color : 'default';
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/follow-up')}
          sx={{ mr: 2 }}
        >
          Back to Follow-ups
        </Button>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {isEdit ? 'Edit Follow-up' : 'Schedule Follow-up'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update follow-up details' : 'Schedule and manage patient follow-up appointment'}
          </Typography>
        </Box>
      </Box>

      {/* Form */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Patient Selection */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary">
                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Patient Information
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  options={searchSuggestions}
                  getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.patientId})`}
                  value={selectedPatient}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      handlePatientSelect(newValue);
                    }
                  }}
                  onInputChange={(_, newInputValue) => {
                    handlePatientSearch(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search and Select Patient *"
                      placeholder="Type patient name, ID, or mobile number..."
                      error={!!errors.patientId}
                      helperText={errors.patientId?.message}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box>
                        <Typography variant="body1">
                          {option.firstName} {option.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.patientId} • {option.mobile} • {option.primaryDisease}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                />
              </Grid>

              {/* Follow-up Scheduling */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom color="primary">
                  <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Follow-up Scheduling
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="followUpDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Follow-up Date *"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.followUpDate,
                          helperText: errors.followUpDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Status *"
                      error={!!errors.status}
                      helperText={errors.status?.message}
                    >
                      {followUpStatuses.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label=""
                              color={option.color}
                              size="small"
                              sx={{ width: 12, height: 12, minWidth: 12 }}
                            />
                            {option.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="nextFollowUpDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Next Follow-up Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.nextFollowUpDate,
                          helperText: errors.nextFollowUpDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Medical Assessment */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom color="primary">
                  <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Medical Assessment
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      Disease Status & Biopsy Results
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="stageOfDisease"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              select
                              label="Stage of Disease"
                            >
                              {diseaseStages.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Controller
                          name="finalBiopsy"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Final Biopsy Results"
                              multiline
                              rows={4}
                              placeholder="Enter detailed biopsy findings and pathology results..."
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center' }}>
                          <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                          <Typography variant="h6" gutterBottom>
                            Upload Biopsy Report
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Upload biopsy report document (PDF, JPG, PNG)
                          </Typography>
                          <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUpload />}
                          >
                            Choose File
                            <input
                              type="file"
                              hidden
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                console.log('Biopsy report file selected:', e.target.files[0]);
                              }}
                            />
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              {/* Treatment Details */}
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      Treatment Progress
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="chemotherapyDetails"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Chemotherapy Details"
                              multiline
                              rows={4}
                              placeholder="Current chemotherapy regimen, cycles completed, response..."
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="radiotherapyDetails"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Radiotherapy Details"
                              multiline
                              rows={4}
                              placeholder="Radiotherapy sessions, dosage, response..."
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              {/* Notes */}
              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Follow-up Notes"
                      multiline
                      rows={4}
                      placeholder="Additional notes, observations, patient concerns, recommendations..."
                    />
                  )}
                />
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/follow-up')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : isEdit ? 'Update Follow-up' : 'Schedule Follow-up'}
                  </Button>
                </Box>
              </Grid>

              {/* Information Alert */}
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Note:</strong> Follow-up appointments help track patient progress and treatment effectiveness.
                    Ensure all assessment details are accurately recorded for continuity of care.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FollowUpFormPage;
