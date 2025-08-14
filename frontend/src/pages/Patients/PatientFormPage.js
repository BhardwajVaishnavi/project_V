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
  Avatar,
  IconButton,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import {
  Save,
  ArrowBack,
  Person,
  PhotoCamera,
  NavigateNext,
  NavigateBefore,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import toast from 'react-hot-toast';

import { createPatient, updatePatient, getPatientById } from '../../store/slices/patientSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

// Validation schema
const schema = yup.object({
  // Personal Information
  firstName: yup.string().required('First name is required').min(2, 'Minimum 2 characters'),
  lastName: yup.string().required('Last name is required').min(2, 'Minimum 2 characters'),
  dateOfBirth: yup.date().required('Date of birth is required').max(new Date(), 'Date cannot be in future'),
  sex: yup.string().required('Sex is required').oneOf(['MALE', 'FEMALE', 'OTHER']),
  aadharNumber: yup.string().nullable().matches(/^\d{12}$/, 'Aadhar number must be 12 digits'),
  referredBy: yup.string().nullable(),

  // Contact Information
  mobile: yup.string().required('Mobile number is required').matches(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
  alternativeNumber: yup.string().nullable().matches(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
  email: yup.string().nullable().email('Enter valid email address'),
  houseVillage: yup.string().nullable(),
  post: yup.string().nullable(),
  city: yup.string().nullable(),
  state: yup.string().nullable(),
  pincode: yup.string().nullable().matches(/^\d{6}$/, 'Pincode must be 6 digits'),
  instagramId: yup.string().nullable(),
  facebookId: yup.string().nullable(),

  // Professional Information
  occupation: yup.string().nullable(),

  // Medical Information
  height: yup.number().nullable().min(50, 'Height must be at least 50 cm').max(250, 'Height cannot exceed 250 cm'),
  weight: yup.number().nullable().min(10, 'Weight must be at least 10 kg').max(300, 'Weight cannot exceed 300 kg'),
  primaryDisease: yup.string().nullable(),
  dateOfVisit: yup.date().nullable(),
});

const steps = ['Personal Information', 'Contact Details', 'Medical Information'];

const PatientFormPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { currentPatient, isLoading } = useSelector((state) => state.patients);
  const [activeStep, setActiveStep] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

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
      firstName: '',
      lastName: '',
      dateOfBirth: null,
      sex: '',
      aadharNumber: '',
      referredBy: '',
      houseVillage: '',
      post: '',
      city: '',
      pincode: '',
      state: '',
      mobile: '',
      alternativeNumber: '',
      email: '',
      instagramId: '',
      facebookId: '',
      occupation: '',
      dateOfVisit: new Date(),
      height: '',
      weight: '',
      primaryDisease: '',
    },
  });

  // Watch height and weight to calculate BMI
  const height = watch('height');
  const weight = watch('weight');

  useEffect(() => {
    if (isEdit && id) {
      dispatch(getPatientById(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentPatient) {
      reset({
        ...currentPatient,
        dateOfBirth: currentPatient.dateOfBirth ? new Date(currentPatient.dateOfBirth) : null,
        dateOfVisit: currentPatient.dateOfVisit ? new Date(currentPatient.dateOfVisit) : new Date(),
      });
      if (currentPatient.profilePhotoUrl) {
        setProfilePhotoPreview(currentPatient.profilePhotoUrl);
      }
    }
  }, [currentPatient, isEdit, reset]);

  // Calculate BMI when height or weight changes
  useEffect(() => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      setValue('bmi', parseFloat(bmi));
    }
  }, [height, weight, setValue]);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        dateOfBirth: data.dateOfBirth?.toISOString(),
        dateOfVisit: data.dateOfVisit?.toISOString(),
      };

      if (isEdit) {
        await dispatch(updatePatient({ id, patientData: formData })).unwrap();
        toast.success('Patient updated successfully!');
      } else {
        await dispatch(createPatient(formData)).unwrap();
        toast.success('Patient created successfully!');
      }

      navigate('/patients');
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

  if (isLoading && isEdit) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LoadingSpinner />
      </Box>
    );
  }

  const renderPersonalInformation = () => (
    <Grid container spacing={3}>
      {/* Profile Photo */}
      <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            src={profilePhotoPreview}
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 2,
              bgcolor: 'primary.main',
            }}
          >
            <Person sx={{ fontSize: '3rem' }} />
          </Avatar>
          <IconButton
            component="label"
            sx={{
              position: 'absolute',
              bottom: 16,
              right: -8,
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            <PhotoCamera />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Click camera icon to upload photo
        </Typography>
      </Grid>

      {/* Basic Information */}
      <Grid item xs={12} sm={6}>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="First Name *"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Last Name *"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              label="Date of Birth *"
              maxDate={new Date()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.dateOfBirth,
                  helperText: errors.dateOfBirth?.message,
                },
              }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
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
          name="aadharNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Aadhar Number"
              placeholder="123456789012"
              error={!!errors.aadharNumber}
              helperText={errors.aadharNumber?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="referredBy"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Referred By"
              placeholder="Dr. Name or Hospital"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="occupation"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Occupation"
              placeholder="Patient's occupation"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="dateOfVisit"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              label="Date of Visit"
              maxDate={new Date()}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );

  const renderContactDetails = () => (
    <Grid container spacing={3}>
      {/* Address Information */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom color="primary">
          Address Information
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="houseVillage"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="House/Village"
              placeholder="House number, street, village"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="post"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Post Office"
              placeholder="Post office name"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="City/District"
              placeholder="City or district name"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="State"
              placeholder="State name"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="pincode"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Pincode"
              placeholder="123456"
              error={!!errors.pincode}
              helperText={errors.pincode?.message}
            />
          )}
        />
      </Grid>

      {/* Contact Information */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom color="primary">
          Contact Information
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="mobile"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Mobile Number *"
              placeholder="9876543210"
              error={!!errors.mobile}
              helperText={errors.mobile?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="alternativeNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Alternative Number"
              placeholder="9876543210"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Email Address"
              placeholder="patient@example.com"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="instagramId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Instagram ID"
              placeholder="@username"
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="facebookId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Facebook ID"
              placeholder="Facebook profile name"
            />
          )}
        />
      </Grid>

      {/* Professional Information */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
          Professional Information
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="occupation"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Occupation"
              placeholder="e.g., Teacher, Engineer, Farmer"
            />
          )}
        />
      </Grid>
    </Grid>
  );

  const renderMedicalInformation = () => (
    <Grid container spacing={3}>
      {/* Physical Measurements */}
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom color="primary">
          Physical Measurements
        </Typography>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Controller
          name="height"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Height (cm)"
              type="number"
              placeholder="175"
              error={!!errors.height}
              helperText={errors.height?.message}
              InputProps={{
                endAdornment: <Typography variant="body2" color="text.secondary">cm</Typography>,
              }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <Controller
          name="weight"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Weight (kg)"
              type="number"
              placeholder="70"
              error={!!errors.weight}
              helperText={errors.weight?.message}
              InputProps={{
                endAdornment: <Typography variant="body2" color="text.secondary">kg</Typography>,
              }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="BMI"
          value={height && weight ? ((weight / ((height / 100) ** 2)).toFixed(2)) : ''}
          InputProps={{
            readOnly: true,
            endAdornment: <Typography variant="body2" color="text.secondary">kg/m²</Typography>,
          }}
          helperText="Calculated automatically"
        />
      </Grid>

      {/* Medical History */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom color="primary">
          Medical Information
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="dateOfVisit"
          control={control}
          render={({ field }) => (
            <DatePicker
              {...field}
              label="Date of Visit"
              maxDate={new Date()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.dateOfVisit,
                  helperText: errors.dateOfVisit?.message,
                },
              }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12}>
        <Controller
          name="primaryDisease"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Primary Disease/Condition"
              placeholder="Primary diagnosis or chief complaint"
              multiline
              rows={3}
            />
          )}
        />
      </Grid>

      {/* Additional Information */}
      <Grid item xs={12}>
        <Alert severity="info">
          <Typography variant="body2">
            Additional medical information such as comorbidities, investigations, and treatments
            can be added after patient registration through the patient detail page.
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderPersonalInformation();
      case 1:
        return renderContactDetails();
      case 2:
        return renderMedicalInformation();
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
          onClick={() => navigate('/patients')}
          sx={{ mr: 2 }}
        >
          Back to Patients
        </Button>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {isEdit ? 'Edit Patient' : 'Add New Patient'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update patient information' : 'Register a new patient in the system'}
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
                      isEdit ? 'Update Patient' : 'Save Patient'
                    )}
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

export default PatientFormPage;
