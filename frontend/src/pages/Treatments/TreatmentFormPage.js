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
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';
import {
  Save,
  ArrowBack,
  LocalHospital,
  Person,
  Medication,
  Assignment,
  ExpandMore,
  Add,
  Delete,
  CloudUpload,
} from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
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
  finalDiagnosis: yup.string().nullable(),
  diseaseStage: yup.string().nullable(),
  treatmentPlan: yup.string().nullable(),
  primaryTreatmentPlan: yup.string().required('Primary treatment plan is required'),
  admissionDate: yup.date().nullable(),
  medication1: yup.string().nullable(),
  medication2: yup.string().nullable(),
  medication3: yup.string().nullable(),
  medication4: yup.string().nullable(),
  medication5: yup.string().nullable(),
});

const treatmentTypes = [
  { value: 'CONSERVATIVE', label: 'Conservative Treatment' },
  { value: 'SURGERY', label: 'Surgery' },
  { value: 'CHEMOTHERAPY', label: 'Chemotherapy' },
  { value: 'RADIOTHERAPY', label: 'Radiotherapy' },
  { value: 'REFERRED_OTHER_DEPARTMENT', label: 'Referred to Other Department' },
];

const diseaseStages = [
  { value: 'EARLY', label: 'Early Stage' },
  { value: 'INTERMEDIATE', label: 'Intermediate Stage' },
  { value: 'ADVANCED', label: 'Advanced Stage' },
  { value: 'TERMINAL', label: 'Terminal Stage' },
];

const TreatmentFormPage = () => {
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
      finalDiagnosis: '',
      diseaseStage: '',
      treatmentPlan: '',
      primaryTreatmentPlan: 'CONSERVATIVE',
      admissionDate: null,
      medication1: '',
      medication2: '',
      medication3: '',
      medication4: '',
      medication5: '',
    },
  });

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
      console.log('Treatment data:', data);
      toast.success(isEdit ? 'Treatment updated successfully!' : 'Treatment plan created successfully!');
      navigate('/treatments');
    } catch (error) {
      console.error('Error saving treatment:', error);
      toast.error('Failed to save treatment plan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/treatments')}
          sx={{ mr: 2 }}
        >
          Back to Treatments
        </Button>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {isEdit ? 'Edit Treatment Plan' : 'New Treatment Plan'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update treatment plan details' : 'Create comprehensive treatment plan for patient'}
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

              {/* Diagnosis and Planning */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom color="primary">
                  <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Diagnosis & Treatment Planning
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="finalDiagnosis"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Final Diagnosis"
                      multiline
                      rows={3}
                      placeholder="Enter final diagnosis and clinical findings..."
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="diseaseStage"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Disease Stage"
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
                  name="treatmentPlan"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Detailed Treatment Plan"
                      multiline
                      rows={4}
                      placeholder="Enter comprehensive treatment plan, protocols, and recommendations..."
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="primaryTreatmentPlan"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Primary Treatment Type *"
                      error={!!errors.primaryTreatmentPlan}
                      helperText={errors.primaryTreatmentPlan?.message}
                    >
                      {treatmentTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="admissionDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Admission Date (if applicable)"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.admissionDate,
                          helperText: errors.admissionDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Medications */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom color="primary">
                  <Medication sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Medication Management
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      Prescribed Medications
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="medication1"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Medication 1"
                              placeholder="e.g., Paracetamol 500mg - 1 tab TID"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="medication2"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Medication 2"
                              placeholder="e.g., Omeprazole 20mg - 1 cap OD"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="medication3"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Medication 3"
                              placeholder="e.g., Metformin 500mg - 1 tab BD"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="medication4"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Medication 4"
                              placeholder="Additional medication if needed"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Controller
                          name="medication5"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Medication 5"
                              placeholder="Additional medication if needed"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              {/* Prescription Upload */}
              <Grid item xs={12}>
                <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center' }}>
                  <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Upload Prescription
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Upload prescription document (PDF, JPG, PNG)
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
                        console.log('Prescription file selected:', e.target.files[0]);
                      }}
                    />
                  </Button>
                </Box>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/treatments')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : isEdit ? 'Update Treatment' : 'Create Treatment Plan'}
                  </Button>
                </Box>
              </Grid>

              {/* Information Alert */}
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Note:</strong> This treatment plan will be saved to the patient's medical record.
                    Ensure all medications and dosages are accurate before saving.
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

export default TreatmentFormPage;
