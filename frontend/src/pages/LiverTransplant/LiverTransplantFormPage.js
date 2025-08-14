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
  Stepper,
  Step,
  StepLabel,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Save,
  ArrowBack,
  NavigateNext,
  NavigateBefore,
  ExpandMore,
  Person,
  Science,
  LocalHospital,
  Assignment,
} from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import toast from 'react-hot-toast';

import {
  createEvaluation,
  updateEvaluation,
  getEvaluationById,
  updateViralMarkers,
  updateClearances,
} from '../../store/slices/liverTransplantSlice';
import { getSearchSuggestions } from '../../store/slices/patientSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

// Validation schema
const schema = yup.object({
  // Patient Information
  patientId: yup.string().required('Patient selection is required'),
  name: yup.string().required('Name is required'),
  age: yup.number().required('Age is required').min(1).max(120),
  sex: yup.string().required('Sex is required').oneOf(['MALE', 'FEMALE', 'OTHER']),
  mrn: yup.string().nullable(),
  address: yup.string().nullable(),
  mobileNumber: yup.string().required('Mobile number is required').matches(/^[6-9]\d{9}$/, 'Enter valid mobile number'),
  heightCm: yup.number().nullable().min(50).max(250),
  weightKg: yup.number().nullable().min(10).max(300),

  // Medical Assessment
  performanceStatus: yup.string().nullable(),
  ecogClass: yup.number().nullable().min(0).max(5),
  sarcopenia: yup.boolean(),
  childScore: yup.number().nullable().min(5).max(15),
  meldNaScore: yup.number().nullable().min(6).max(40),
  etiologyNonAlcoholic: yup.string().nullable(),
  decompensation: yup.string().nullable(),
  comorbidities: yup.string().nullable(),
  sixMinuteWalkTest: yup.string().nullable(),

  // Blood Group
  bloodGroupSubtype: yup.string().nullable(),

  // CBC
  hemoglobin: yup.number().nullable().min(0).max(25),
  totalCount: yup.number().nullable().min(0),
  plateletCount: yup.number().nullable().min(0),
  hematocrit: yup.number().nullable().min(0).max(100),

  // LFT
  totalBilirubin: yup.number().nullable().min(0),
  directBilirubin: yup.number().nullable().min(0),
  indirectBilirubin: yup.number().nullable().min(0),
  sgot: yup.number().nullable().min(0),
  sgpt: yup.number().nullable().min(0),
  alkalinePhosphatase: yup.number().nullable().min(0),
  albumin: yup.number().nullable().min(0),
  totalProtein: yup.number().nullable().min(0),

  // KFT
  urea: yup.number().nullable().min(0),
  creatinine: yup.number().nullable().min(0),
  sodium: yup.number().nullable().min(0),
  potassium: yup.number().nullable().min(0),
  chloride: yup.number().nullable().min(0),
});

const steps = [
  'Patient Information',
  'Blood Investigations',
  'Viral Markers',
  'Imaging Studies',
  'Specialist Evaluations',
  'Clearances'
];

const LiverTransplantFormPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { currentEvaluation, isLoading } = useSelector((state) => state.liverTransplant);
  const { searchSuggestions } = useSelector((state) => state.patients);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState(null);

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
      // Patient Information
      patientId: '',
      name: '',
      age: '',
      sex: '',
      mrn: '',
      address: '',
      mobileNumber: '',
      heightCm: '',
      weightKg: '',

      // Medical Assessment
      performanceStatus: '',
      ecogClass: '',
      sarcopenia: false,
      childScore: '',
      meldNaScore: '',
      etiologyNonAlcoholic: '',
      decompensation: '',
      comorbidities: '',
      sixMinuteWalkTest: '',

      // Blood Group
      bloodGroupSubtype: '',

      // CBC
      hemoglobin: '',
      totalCount: '',
      plateletCount: '',
      hematocrit: '',

      // LFT
      totalBilirubin: '',
      directBilirubin: '',
      indirectBilirubin: '',
      sgot: '',
      sgpt: '',
      alkalinePhosphatase: '',
      albumin: '',
      totalProtein: '',

      // KFT
      urea: '',
      creatinine: '',
      sodium: '',
      potassium: '',
      chloride: '',
    },
  });

  const height = watch('heightCm');
  const weight = watch('weightKg');

  useEffect(() => {
    if (isEdit && id) {
      dispatch(getEvaluationById(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentEvaluation) {
      reset(currentEvaluation);
    }
  }, [currentEvaluation, isEdit, reset]);

  // Calculate BMI
  useEffect(() => {
    if (height && weight) {
      const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
      setValue('bmiKgM2', parseFloat(bmi));
    }
  }, [height, weight, setValue]);

  const handlePatientSearch = async (searchTerm) => {
    if (searchTerm.length >= 2) {
      dispatch(getSearchSuggestions(searchTerm));
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setValue('patientId', patient.id);
    setValue('name', `${patient.firstName} ${patient.lastName}`);
    setValue('age', patient.age);
    setValue('sex', patient.sex);
    setValue('mobileNumber', patient.mobile);
  };

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await dispatch(updateEvaluation({ id, evaluationData: data })).unwrap();
        toast.success('Evaluation updated successfully!');
      } else {
        await dispatch(createEvaluation(data)).unwrap();
        toast.success('Evaluation created successfully!');
      }

      navigate('/liver-transplant');
    } catch (error) {
      toast.error(error || 'An error occurred');
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderPatientInformation = () => (
    <Grid container spacing={3}>
      {/* Patient Selection */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom color="primary">
          Patient Selection
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Search and select an existing patient or enter patient details manually.
        </Alert>
      </Grid>

      {/* Patient Search */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Search Patient"
          placeholder="Type patient name, ID, or mobile number..."
          onChange={(e) => handlePatientSearch(e.target.value)}
        />
        {searchSuggestions.length > 0 && (
          <Paper sx={{ mt: 1, maxHeight: 200, overflow: 'auto' }}>
            {searchSuggestions.map((patient) => (
              <Box
                key={patient.id}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
                onClick={() => handlePatientSelect(patient)}
              >
                <Typography variant="subtitle2">
                  {patient.firstName} {patient.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {patient.patientId} • {patient.age}y • {patient.sex} • {patient.mobile}
                </Typography>
              </Box>
            ))}
          </Paper>
        )}
      </Grid>

      {/* Patient Details */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom color="primary">
          Patient Details
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Full Name *"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={3}>
        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Age *"
              type="number"
              error={!!errors.age}
              helperText={errors.age?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={3}>
        <Controller
          name="sex"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              select
              label="Sex *"
              error={!!errors.sex}
              helperText={errors.sex?.message}
            >
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </TextField>
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="mobileNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Mobile Number *"
              error={!!errors.mobileNumber}
              helperText={errors.mobileNumber?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="mrn"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="MRN (Medical Record Number)"
            />
          )}
        />
      </Grid>

      {/* Physical Measurements */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom color="primary">
          Physical Measurements
        </Typography>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Controller
          name="heightCm"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Height (cm)"
              type="number"
              error={!!errors.heightCm}
              helperText={errors.heightCm?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <Controller
          name="weightKg"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Weight (kg)"
              type="number"
              error={!!errors.weightKg}
              helperText={errors.weightKg?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="BMI (kg/m²)"
          value={height && weight ? ((weight / ((height / 100) ** 2)).toFixed(2)) : ''}
          InputProps={{ readOnly: true }}
          helperText="Calculated automatically"
        />
      </Grid>
    </Grid>
  );

  const renderBloodInvestigations = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom color="primary">
          Blood Investigations
        </Typography>
      </Grid>

      {/* Blood Group */}
      <Grid item xs={12}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              Blood Group & Type
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="bloodGroupSubtype"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Blood Group & Subtype"
                    >
                      <MenuItem value="A+">A+</MenuItem>
                      <MenuItem value="A-">A-</MenuItem>
                      <MenuItem value="B+">B+</MenuItem>
                      <MenuItem value="B-">B-</MenuItem>
                      <MenuItem value="AB+">AB+</MenuItem>
                      <MenuItem value="AB-">AB-</MenuItem>
                      <MenuItem value="O+">O+</MenuItem>
                      <MenuItem value="O-">O-</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>

      {/* CBC */}
      <Grid item xs={12}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              Complete Blood Count (CBC)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="hemoglobin"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Hemoglobin (g/dL)"
                      type="number"
                      step="0.1"
                      placeholder="12.0-16.0"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="totalCount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Total Count (/μL)"
                      type="number"
                      placeholder="4000-11000"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="plateletCount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Platelet Count (/μL)"
                      type="number"
                      placeholder="150000-450000"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="hematocrit"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Hematocrit (%)"
                      type="number"
                      step="0.1"
                      placeholder="36-46"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>

      {/* Liver Function Tests */}
      <Grid item xs={12}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              Liver Function Tests (LFT)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="totalBilirubin"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Total Bilirubin (mg/dL)"
                      type="number"
                      step="0.1"
                      placeholder="0.3-1.2"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="directBilirubin"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Direct Bilirubin (mg/dL)"
                      type="number"
                      step="0.1"
                      placeholder="0.0-0.3"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="indirectBilirubin"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Indirect Bilirubin (mg/dL)"
                      type="number"
                      step="0.1"
                      placeholder="0.2-0.8"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="sgot"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="SGOT/AST (U/L)"
                      type="number"
                      placeholder="8-40"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="sgpt"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="SGPT/ALT (U/L)"
                      type="number"
                      placeholder="7-56"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="alkalinePhosphatase"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Alkaline Phosphatase (U/L)"
                      type="number"
                      placeholder="44-147"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="albumin"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Albumin (g/dL)"
                      type="number"
                      step="0.1"
                      placeholder="3.5-5.0"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="totalProtein"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Total Protein (g/dL)"
                      type="number"
                      step="0.1"
                      placeholder="6.0-8.3"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>

      {/* Kidney Function Tests */}
      <Grid item xs={12}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              Kidney Function Tests (KFT)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="urea"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Urea (mg/dL)"
                      type="number"
                      step="0.1"
                      placeholder="15-40"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="creatinine"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Creatinine (mg/dL)"
                      type="number"
                      step="0.1"
                      placeholder="0.6-1.2"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="sodium"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Sodium (mEq/L)"
                      type="number"
                      step="0.1"
                      placeholder="136-145"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="potassium"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Potassium (mEq/L)"
                      type="number"
                      step="0.1"
                      placeholder="3.5-5.0"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="chloride"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Chloride (mEq/L)"
                      type="number"
                      step="0.1"
                      placeholder="98-107"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );

  const renderViralMarkers = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom color="primary">
          Viral Markers
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Alert severity="info">
          <Typography variant="body1">
            Viral markers section will be implemented with comprehensive viral screening
            including Hepatitis B, Hepatitis C, HIV, and other relevant viral markers.
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  );

  const renderPhysicalMeasurements = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom color="primary">
          Physical Measurements
        </Typography>
      </Grid>

        <Controller
          name="heightCm"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Height (cm)"
              type="number"
              placeholder="150-200"
              error={!!errors.heightCm}
              helperText={errors.heightCm?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Controller
          name="weightKg"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Weight (kg)"
              type="number"
              placeholder="40-150"
              error={!!errors.weightKg}
              helperText={errors.weightKg?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="BMI"
          value={calculateBMI()}
          InputProps={{
            readOnly: true,
          }}
          placeholder="Auto-calculated"
        />
      </Grid>
    </Grid>
  );

  const renderPlaceholderSection = (title, description) => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom color="primary">
          {title}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Alert severity="info">
          <Typography variant="body1">
            {description}
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderPatientInformation();
      case 1:
        return renderBloodInvestigations();
      case 2:
        return renderViralMarkers();
      case 3:
        return renderPhysicalMeasurements();
      case 4:
        return renderPlaceholderSection(
          'Imaging Studies',
          'This section will include CT scan, MRI, ultrasound, and other imaging study results.'
        );
      case 5:
        return renderPlaceholderSection(
          'Final Assessment',
          'This section will include final evaluation, recommendations, and clearance decisions.'
        );
      default:
        return 'Unknown step';
    }
  };

  const renderViralMarkersContent = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom color="primary">
          Viral Markers
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Enter viral marker test results. Leave blank if not tested.
        </Alert>
      </Grid>

      {/* Hepatitis B */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
          Hepatitis B Markers
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="HBsAg"
          select
          defaultValue=""
        >
          <MenuItem value="">Not Tested</MenuItem>
          <MenuItem value="POSITIVE">Positive</MenuItem>
          <MenuItem value="NEGATIVE">Negative</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Anti-HBc"
          select
          defaultValue=""
        >
          <MenuItem value="">Not Tested</MenuItem>
          <MenuItem value="POSITIVE">Positive</MenuItem>
          <MenuItem value="NEGATIVE">Negative</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Anti-HBs"
          select
          defaultValue=""
        >
          <MenuItem value="">Not Tested</MenuItem>
          <MenuItem value="POSITIVE">Positive</MenuItem>
          <MenuItem value="NEGATIVE">Negative</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="HBeAg"
          select
          defaultValue=""
        >
          <MenuItem value="">Not Tested</MenuItem>
          <MenuItem value="POSITIVE">Positive</MenuItem>
          <MenuItem value="NEGATIVE">Negative</MenuItem>
        </TextField>
      </Grid>

      {/* Hepatitis C */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
          Hepatitis C Markers
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Anti-HCV"
          select
          defaultValue=""
        >
          <MenuItem value="">Not Tested</MenuItem>
          <MenuItem value="POSITIVE">Positive</MenuItem>
          <MenuItem value="NEGATIVE">Negative</MenuItem>
        </TextField>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="HCV RNA"
          select
          defaultValue=""
        >
          <MenuItem value="">Not Tested</MenuItem>
          <MenuItem value="DETECTED">Detected</MenuItem>
          <MenuItem value="NOT_DETECTED">Not Detected</MenuItem>
        </TextField>
      </Grid>

      {/* HIV */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
          HIV Markers
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="HIV 1 & 2"
          select
          defaultValue=""
        >
          <MenuItem value="">Not Tested</MenuItem>
          <MenuItem value="POSITIVE">Positive</MenuItem>
          <MenuItem value="NEGATIVE">Negative</MenuItem>
        </TextField>
      </Grid>
    </Grid>
  );

  const renderPlaceholderSection = (title, description) => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom color="primary">
          {title}
        </Typography>
        <Alert severity="info">
          <Typography variant="body2">
            {description} This section will be fully implemented in the next phase.
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderPatientInformation();
      case 1:
        return renderBloodInvestigations();
      case 2:
        return renderViralMarkers();
      case 3:
        return renderPlaceholderSection(
          'Imaging Studies',
          'This section will include CT scan, MRI, ultrasound, and other imaging study results.'
        );
      case 4:
        return renderPlaceholderSection(
          'Specialist Evaluations',
          'This section will include cardiology, pulmonology, psychiatry, and other specialist evaluations.'
        );
      case 5:
        return renderPlaceholderSection(
          'Clearances',
          'This section will include medical clearances from various departments and specialists.'
        );
      default:
        return 'Unknown step';
    }
  };

  if (isLoading && isEdit) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/liver-transplant')}
          sx={{ mr: 2 }}
        >
          Back to Evaluations
        </Button>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {isEdit ? 'Edit Liver Transplant Evaluation' : 'New Liver Transplant Evaluation'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update evaluation details' : 'Complete comprehensive liver transplant evaluation'}
          </Typography>
        </Box>
      </Box>

      {/* Progress Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={({ active, completed }) => (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: completed ? 'success.main' : active ? 'primary.main' : 'grey.300',
                      color: 'white',
                    }}
                  >
                    {index === 0 && <Person />}
                    {index === 1 && <Science />}
                    {index === 2 && <LocalHospital />}
                    {index >= 3 && <Assignment />}
                  </Box>
                )}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Form Content */}
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
                {activeStep < steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={<NavigateNext />}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingSpinner size={20} showMessage={false} color="inherit" />
                    ) : (
                      isEdit ? 'Update Evaluation' : 'Save Evaluation'
                    )}
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Evaluation Guidelines
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" paragraph>
                <strong>Step 1:</strong> Select patient and verify demographic information.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Step 2:</strong> Enter all available blood investigation results.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Step 3:</strong> Record viral marker test results for hepatitis and HIV.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" paragraph>
                <strong>Step 4-6:</strong> Additional sections for imaging, specialist evaluations, and clearances will be completed in subsequent phases.
              </Typography>
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  This is a comprehensive evaluation form. You can save progress at any step and continue later.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LiverTransplantFormPage;
