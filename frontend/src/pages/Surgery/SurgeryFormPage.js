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
  Stepper,
  Step,
  StepLabel,
  Paper,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Save,
  ArrowBack,
  MedicalServices,
  Person,
  CalendarToday,
  Assignment,
  LocalHospital,
  NavigateNext,
  NavigateBefore,
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
  nameOfSurgery: yup.string().nullable(),
  planDate: yup.date().nullable(),
  dateOfSurgery: yup.date().nullable(),
  surgeon: yup.string().nullable(),
  assistantSurgeon: yup.string().nullable(),
  consentObtained: yup.boolean(),
  clavienDindoGrade: yup.number().nullable().min(1).max(5),
  hospitalStay: yup.number().nullable().min(0),
});

const steps = [
  'Patient & Planning',
  'Surgery Execution',
  'Post-operative Care',
  'Discharge Management'
];

const clavienDindoGrades = [
  { value: 1, label: 'Grade I - Minor complications' },
  { value: 2, label: 'Grade II - Moderate complications' },
  { value: 3, label: 'Grade III - Severe complications' },
  { value: 4, label: 'Grade IV - Life-threatening complications' },
  { value: 5, label: 'Grade V - Death' },
];

const SurgeryFormPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [activeStep, setActiveStep] = useState(0);
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
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      patientId: '',
      planDate: null,
      nameOfSurgery: '',
      risksAssociated: '',
      consentObtained: false,
      dateOfSurgery: null,
      surgeon: '',
      assistantSurgeon: '',
      otFindings: '',
      otProcedure: '',
      hospitalCourse: '',
      complications: '',
      clavienDindoGrade: '',
      dateOfDischarge: null,
      dischargeMedication1: '',
      dischargeMedication2: '',
      dischargeMedication3: '',
      dischargeMedication4: '',
      dischargeMedication5: '',
      dischargeMedication6: '',
      dischargeAdvice: '',
      nextFollowUp: null,
      hospitalStay: '',
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

  const handleNext = async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      console.log('Surgery data:', data);
      toast.success(isEdit ? 'Surgery details updated successfully!' : 'Surgery scheduled successfully!');
      navigate('/surgery');
    } catch (error) {
      console.error('Error saving surgery:', error);
      toast.error('Failed to save surgery details');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPatientAndPlanning = () => (
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

      {/* Surgery Planning */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom color="primary">
          <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
          Surgery Planning
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="planDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              label="Planned Surgery Date"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.planDate,
                  helperText: errors.planDate?.message,
                },
              }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="nameOfSurgery"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Name of Surgery"
              placeholder="e.g., Laparoscopic Cholecystectomy"
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="risksAssociated"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Risks Associated"
              multiline
              rows={4}
              placeholder="List all potential risks and complications associated with the surgery..."
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="consentObtained"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                />
              }
              label="Informed consent obtained from patient/guardian"
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center' }}>
          <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="h6" gutterBottom>
            Upload Consent Form
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Upload signed consent document (PDF, JPG, PNG)
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
                console.log('Consent file selected:', e.target.files[0]);
              }}
            />
          </Button>
        </Box>
      </Grid>
    </Grid>
  );

  const renderSurgeryExecution = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom color="primary">
          <MedicalServices sx={{ mr: 1, verticalAlign: 'middle' }} />
          Surgery Execution
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="dateOfSurgery"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              label="Actual Surgery Date"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.dateOfSurgery,
                  helperText: errors.dateOfSurgery?.message,
                },
              }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="surgeon"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Primary Surgeon"
              placeholder="Dr. Name"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="assistantSurgeon"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Assistant Surgeon"
              placeholder="Dr. Name"
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="otFindings"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Operating Theater Findings"
              multiline
              rows={4}
              placeholder="Detailed findings during surgery..."
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="otProcedure"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Operating Theater Procedure"
              multiline
              rows={4}
              placeholder="Step-by-step procedure performed..."
            />
          )}
        />
      </Grid>
    </Grid>
  );

  const renderPostOperativeCare = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom color="primary">
          <LocalHospital sx={{ mr: 1, verticalAlign: 'middle' }} />
          Post-operative Care
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="hospitalCourse"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Hospital Course"
              multiline
              rows={4}
              placeholder="Patient's progress during hospital stay..."
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="complications"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Complications (if any)"
              multiline
              rows={3}
              placeholder="Any complications encountered..."
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="clavienDindoGrade"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              select
              label="Clavien-Dindo Morbidity Grade"
            >
              {clavienDindoGrades.map((option) => (
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
          name="hospitalStay"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Hospital Stay (days)"
              type="number"
              placeholder="Number of days"
            />
          )}
        />
      </Grid>
    </Grid>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderPatientAndPlanning();
      case 1:
        return renderSurgeryExecution();
      case 2:
        return renderPostOperativeCare();
      case 3:
        return (
          <Alert severity="info">
            <Typography variant="body1">
              Discharge management section will be implemented with medication management,
              discharge advice, and follow-up scheduling.
            </Typography>
          </Alert>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/surgery')}
          sx={{ mr: 2 }}
        >
          Back to Surgery
        </Button>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {isEdit ? 'Edit Surgery Details' : 'New Surgery Management'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update surgery details' : 'Complete surgery workflow from planning to discharge'}
          </Typography>
        </Box>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Form */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {getStepContent(activeStep)}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                startIcon={<NavigateBefore />}
              >
                Back
              </Button>

              <Box sx={{ display: 'flex', gap: 2 }}>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : isEdit ? 'Update Surgery' : 'Save Surgery Details'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={<NavigateNext />}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SurgeryFormPage;
