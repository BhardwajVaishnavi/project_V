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

// Indian States and Cities data
const INDIAN_STATES_CITIES = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Kadapa', 'Anantapur', 'Eluru'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tezpur', 'Bomdila', 'Ziro', 'Along', 'Tezu', 'Changlang', 'Khonsa'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Barpeta', 'Dhubri', 'Karimganj'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Korba', 'Bilaspur', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Raigarh', 'Ambikapur', 'Mahasamund'],
  'Goa': ['Panaji', 'Vasco da Gama', 'Margao', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem', 'Sanquelim', 'Cuncolim', 'Quepem'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Navsari'],
  'Haryana': ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Palampur', 'Baddi', 'Nahan', 'Paonta Sahib', 'Sundarnagar', 'Chamba'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Phusro', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Malappuram', 'Kannur', 'Kasaragod'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur', 'Sangli'],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Kakching', 'Ukhrul', 'Senapati', 'Tamenglong', 'Jiribam', 'Chandel'],
  'Meghalaya': ['Shillong', 'Tura', 'Cherrapunji', 'Jowai', 'Baghmara', 'Williamnagar', 'Nongstoin', 'Mawkyrwat', 'Resubelpara', 'Ampati'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib', 'Serchhip', 'Mamit', 'Lawngtlai', 'Saitual', 'Khawzawl'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Phek', 'Kiphire', 'Longleng', 'Peren'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Firozpur', 'Batala', 'Pathankot', 'Moga'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar'],
  'Sikkim': ['Gangtok', 'Namchi', 'Geyzing', 'Mangan', 'Jorethang', 'Nayabazar', 'Rangpo', 'Singtam', 'Yuksom', 'Pelling'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Thoothukkudi'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet'],
  'Tripura': ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailasahar', 'Belonia', 'Khowai', 'Pratapgarh', 'Ranirbazar', 'Sonamura', 'Kamalpur'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly', 'Aligarh', 'Moradabad'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Kotdwar', 'Ramnagar', 'Manglaur'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Malda', 'Bardhaman', 'Kharagpur', 'Haldia', 'Raiganj'],
  'Delhi': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'North East Delhi', 'North West Delhi', 'South East Delhi', 'South West Delhi'],
  'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Sopore', 'Kathua', 'Udhampur', 'Punch', 'Rajouri', 'Kupwara'],
  'Ladakh': ['Leh', 'Kargil', 'Nubra', 'Changthang', 'Zanskar', 'Drass', 'Sankoo', 'Turtuk', 'Diskit', 'Panamik'],
  'Chandigarh': ['Chandigarh'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Diu', 'Silvassa'],
  'Lakshadweep': ['Kavaratti', 'Agatti', 'Minicoy'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam']
};

// Validation schema with enhanced Indian validation
const schema = yup.object({
  // Personal Information
  firstName: yup.string()
    .required('First name is required')
    .min(2, 'Minimum 2 characters')
    .max(50, 'Maximum 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces allowed'),
  lastName: yup.string()
    .required('Last name is required')
    .min(2, 'Minimum 2 characters')
    .max(50, 'Maximum 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces allowed'),
  dateOfBirth: yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date cannot be in future')
    .test('age', 'Age must be between 0 and 120 years', function(value) {
      if (!value) return false;
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      return age >= 0 && age <= 120;
    }),
  sex: yup.string().required('Sex is required').oneOf(['MALE', 'FEMALE', 'OTHER']),
  aadharNumber: yup.string()
    .nullable()
    .matches(/^\d{12}$/, 'Aadhar number must be exactly 12 digits')
    .test('aadhar-valid', 'Invalid Aadhar number', function(value) {
      if (!value) return true; // Optional field
      // Basic Aadhar validation - no repeated digits
      return !/^(\d)\1{11}$/.test(value);
    }),
  referredBy: yup.string().nullable().max(100, 'Maximum 100 characters'),

  // Contact Information with Indian validation
  mobile: yup.string()
    .required('Mobile number is required')
    .matches(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian mobile number (starting with 6-9)'),
  alternativeNumber: yup.string()
    .nullable()
    .matches(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian mobile number (starting with 6-9)'),
  email: yup.string()
    .nullable()
    .email('Enter valid email address')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Enter valid email format'),
  houseVillage: yup.string().nullable().max(200, 'Maximum 200 characters'),
  post: yup.string().nullable().max(100, 'Maximum 100 characters'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  pincode: yup.string()
    .nullable()
    .matches(/^\d{6}$/, 'Pincode must be exactly 6 digits')
    .test('pincode-valid', 'Invalid pincode', function(value) {
      if (!value) return true; // Optional field
      // Basic pincode validation - should not be all zeros
      return value !== '000000';
    }),
  instagramId: yup.string().nullable().max(50, 'Maximum 50 characters'),
  facebookId: yup.string().nullable().max(50, 'Maximum 50 characters'),

  // Professional Information
  occupation: yup.string().nullable().max(100, 'Maximum 100 characters'),

  // Medical Information
  height: yup.number()
    .nullable()
    .min(50, 'Height must be at least 50 cm')
    .max(250, 'Height cannot exceed 250 cm'),
  weight: yup.number()
    .nullable()
    .min(10, 'Weight must be at least 10 kg')
    .max(300, 'Weight cannot exceed 300 kg'),
  primaryDisease: yup.string().nullable().max(200, 'Maximum 200 characters'),
  dateOfVisit: yup.date().nullable().max(new Date(), 'Visit date cannot be in future'),
  bloodGroup: yup.string().nullable().oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'Invalid blood group'),
  meldScore: yup.number().nullable().min(0, 'MELD score must be positive').max(40, 'MELD score cannot exceed 40'),
  transplantType: yup.string().nullable().oneOf(['DDLT', 'LDLT'], 'Invalid transplant type'),
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
  const [selectedState, setSelectedState] = useState('');
  const [availableCities, setAvailableCities] = useState([]);

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
      dateOfVisit: null,
      height: '',
      weight: '',
      primaryDisease: '',
      bloodGroup: '',
      meldScore: '',
      transplantType: '',
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
      // Helper function to safely parse dates
      const parseDate = (dateString) => {
        if (!dateString) return null;
        try {
          const date = new Date(dateString);
          return isNaN(date.getTime()) ? null : date;
        } catch (error) {
          console.warn('Invalid date:', dateString);
          return null;
        }
      };

      reset({
        ...currentPatient,
        dateOfBirth: parseDate(currentPatient.dateOfBirth),
        dateOfVisit: parseDate(currentPatient.dateOfVisit),
      });

      // Initialize state and city dropdowns for edit mode
      if (currentPatient.state) {
        setSelectedState(currentPatient.state);
        setAvailableCities(INDIAN_STATES_CITIES[currentPatient.state] || []);
      }

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
    console.log('🚀 Form submission triggered!');
    console.log('📋 Form errors:', errors);
    console.log('📝 Form data received:', data);

    try {

      // Helper function to safely convert dates to ISO string
      const formatDate = (date) => {
        if (!date) return null;
        try {
          return date instanceof Date && !isNaN(date.getTime()) ? date.toISOString() : null;
        } catch (error) {
          console.warn('Invalid date format:', date);
          return null;
        }
      };

      const formData = {
        ...data,
        dateOfBirth: formatDate(data.dateOfBirth),
        dateOfVisit: formatDate(data.dateOfVisit),
      };

      console.log('🔄 Processed form data:', formData);
      console.log('📅 Date of Visit in form data:', {
        original: data.dateOfVisit,
        formatted: formatDate(data.dateOfVisit),
        type: typeof data.dateOfVisit
      });

      if (isEdit) {
        console.log('✏️ Updating patient with ID:', id);
        const result = await dispatch(updatePatient({ id, patientData: formData })).unwrap();
        console.log('✅ Patient updated successfully:', result);
        toast.success('Patient updated successfully!');
      } else {
        console.log('➕ Creating new patient...');
        const result = await dispatch(createPatient(formData)).unwrap();
        console.log('✅ Patient created successfully:', result);
        toast.success('Patient created successfully!');
      }

      navigate('/patients');
    } catch (error) {
      console.error('❌ Patient submission error:', error);

      // Enhanced error handling
      let errorMessage = 'An error occurred';

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      console.error('📋 Error details:', {
        error,
        message: errorMessage,
        stack: error?.stack
      });

      toast.error(errorMessage);
    }
  };

  // Handle state change to update available cities
  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    setAvailableCities(INDIAN_STATES_CITIES[stateName] || []);
    // Reset city when state changes
    setValue('city', '');
  };

  // Define fields for each step
  const stepFields = {
    0: ['firstName', 'lastName', 'dateOfBirth', 'sex'], // Personal Information
    1: ['mobile', 'state', 'city'], // Contact Details (required fields only)
    2: [], // Medical Information - no required fields, so validate all fields
  };

  const handleNext = async () => {
    console.log('🔄 Validating step:', activeStep);

    // Get fields to validate for current step
    const fieldsToValidate = stepFields[activeStep] || [];
    console.log('📋 Fields to validate:', fieldsToValidate);

    // If no specific fields to validate, just move to next step
    if (fieldsToValidate.length === 0) {
      console.log('✅ No required fields in this step, moving to next step');
      setActiveStep((prevStep) => prevStep + 1);
      return;
    }

    // Trigger validation for current step fields
    const isStepValid = await trigger(fieldsToValidate);
    console.log('✅ Step validation result:', isStepValid);

    if (isStepValid) {
      console.log('✅ Moving to next step');
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      console.log('❌ Validation failed, staying on current step');
      // Show which fields have errors
      fieldsToValidate.forEach(field => {
        if (errors[field]) {
          console.log(`❌ Error in ${field}:`, errors[field].message);
        }
      });
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Debug function to log current form values
  const logFormValues = () => {
    const currentValues = watch();
    console.log('🔍 Current form values:', currentValues);
    console.log('📅 Date of Visit value:', currentValues.dateOfVisit);
    console.log('📅 Date of Visit type:', typeof currentValues.dateOfVisit);
  };

  // Debug function to validate entire form
  const validateEntireForm = async () => {
    console.log('🔍 Validating entire form...');
    const isValid = await trigger();
    console.log('✅ Form validation result:', isValid);
    console.log('📋 Current errors:', errors);

    // Check each required field
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'sex', 'mobile', 'state', 'city'];
    requiredFields.forEach(field => {
      const value = watch(field);
      console.log(`📝 ${field}:`, value, errors[field] ? `❌ ${errors[field].message}` : '✅');
    });

    return isValid;
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
              value={field.value || null} // Ensure null instead of undefined
              onChange={(date) => {
                // Validate date before setting
                if (date && !isNaN(date.getTime())) {
                  field.onChange(date);
                } else {
                  field.onChange(null);
                }
              }}
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
              type="text"
              inputProps={{
                maxLength: 12,
                pattern: '[0-9]{12}',
              }}
              onChange={(e) => {
                // Only allow digits and limit to 12 characters
                const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                field.onChange(value);
              }}
              error={!!errors.aadharNumber}
              helperText={errors.aadharNumber?.message || 'Enter 12-digit Aadhar number (optional)'}
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
        <TextField
          fullWidth
          label="Country"
          value="India"
          InputProps={{
            readOnly: true,
          }}
          helperText="Currently supporting India only"
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="state"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              fullWidth
              label="State *"
              placeholder="Select state"
              onChange={(e) => {
                field.onChange(e.target.value);
                handleStateChange(e.target.value);
              }}
              error={!!errors.state}
              helperText={errors.state?.message}
            >
              <MenuItem value="">
                <em>Select State</em>
              </MenuItem>
              {Object.keys(INDIAN_STATES_CITIES).map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </TextField>
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
              select
              fullWidth
              label="City/District *"
              placeholder="Select city"
              disabled={!selectedState}
              error={!!errors.city}
              helperText={errors.city?.message || (!selectedState ? 'Please select state first' : '')}
            >
              <MenuItem value="">
                <em>Select City</em>
              </MenuItem>
              {availableCities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </TextField>
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
              type="text"
              inputProps={{
                maxLength: 6,
                pattern: '[0-9]{6}',
              }}
              onChange={(e) => {
                // Only allow digits and limit to 6 characters
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                field.onChange(value);
              }}
              error={!!errors.pincode}
              helperText={errors.pincode?.message || 'Enter 6-digit Indian pincode'}
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
              type="tel"
              inputProps={{
                maxLength: 10,
                pattern: '[6-9][0-9]{9}',
              }}
              onChange={(e) => {
                // Only allow digits and limit to 10 characters
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                field.onChange(value);
              }}
              error={!!errors.mobile}
              helperText={errors.mobile?.message || 'Enter 10-digit Indian mobile number starting with 6-9'}
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
              type="tel"
              inputProps={{
                maxLength: 10,
                pattern: '[6-9][0-9]{9}',
              }}
              onChange={(e) => {
                // Only allow digits and limit to 10 characters
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                field.onChange(value);
              }}
              error={!!errors.alternativeNumber}
              helperText={errors.alternativeNumber?.message || 'Enter 10-digit Indian mobile number starting with 6-9'}
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
              type="email"
              onChange={(e) => {
                // Convert to lowercase for consistency
                const value = e.target.value.toLowerCase();
                field.onChange(value);
              }}
              error={!!errors.email}
              helperText={errors.email?.message || 'Enter valid email address (optional)'}
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
              value={field.value || null} // Ensure null instead of undefined
              onChange={(date) => {
                console.log('📅 Date of Visit changed:', date);
                // Always set the date, let validation handle it
                field.onChange(date);
              }}
              label="Date of Visit"
              maxDate={new Date()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.dateOfVisit,
                  helperText: errors.dateOfVisit?.message || 'Select the date of patient visit',
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

      {/* Additional Medical Information */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom color="primary">
          Additional Medical Information
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="bloodGroup"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              select
              label="Blood Group"
              error={!!errors.bloodGroup}
              helperText={errors.bloodGroup?.message}
            >
              <MenuItem value="">
                <em>Select Blood Group</em>
              </MenuItem>
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

      <Grid item xs={12} sm={6}>
        <Controller
          name="meldScore"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="MELD Score"
              type="number"
              placeholder="0-40"
              error={!!errors.meldScore}
              helperText={errors.meldScore?.message || 'Model for End-Stage Liver Disease score (optional)'}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <Controller
          name="transplantType"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              select
              label="Transplant Type"
              error={!!errors.transplantType}
              helperText={errors.transplantType?.message}
            >
              <MenuItem value="">
                <em>Select Transplant Type</em>
              </MenuItem>
              <MenuItem value="DDLT">DDLT (Deceased Donor)</MenuItem>
              <MenuItem value="LDLT">LDLT (Living Donor)</MenuItem>
            </TextField>
          )}
        />
      </Grid>

      {/* Debug Buttons - Remove in production */}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            onClick={logFormValues}
          >
            🔍 Debug: Log Form Values
          </Button>
          <Button
            variant="outlined"
            onClick={validateEntireForm}
          >
            ✅ Debug: Validate Form
          </Button>
        </Box>
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
                    onClick={async (e) => {
                      console.log('💾 Save button clicked!');
                      console.log('📋 Current form errors:', errors);
                      console.log('🔍 Form values:', watch());

                      // Validate entire form before submission
                      const isValid = await trigger();
                      console.log('✅ Form validation result:', isValid);

                      if (!isValid) {
                        console.log('❌ Form has validation errors');
                        toast.error('Please fix all validation errors before submitting');
                        e.preventDefault();
                      }
                    }}
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
