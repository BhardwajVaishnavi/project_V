import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Divider,
  Alert,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  LocalHospital as MedicalIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import toast from 'react-hot-toast';
import campService from '../../services/campService';

const CampRegistrationPage = () => {
  const navigate = useNavigate();
  const { campId } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [camp, setCamp] = useState(null);
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: '',
    dateOfBirth: null,
    age: '',
    gender: '',
    mobileNumber: '',
    address: '',
    emailId: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    
    // Service Selection
    selectedServices: [],
    
    // Medical History & Symptoms
    abdominalPain: false,
    bloatingGas: false,
    nauseaVomiting: false,
    heartburnAcidReflux: false,
    difficultySwallowing: false,
    bowelHabitsChange: false,
    unexplainedWeightLoss: false,
    lossOfAppetite: false,
    jaundiceYellowEyes: false,
    
    // Previous History
    liverDisease: false,
    kidneyProblems: false,
    heartConditions: false,
    diabetes: false,
    highBloodPressure: false,
    previousEndoscopy: false,
    
    // Risk Assessment
    alcoholConsumption: false,
    alcoholFrequency: '',
    smoking: false,
    familyHistoryGastro: false,
    
    // Administrative Fields
    paymentStatus: 'PENDING',
    preferredTimeSlot: '',
    consentForProcedures: false,
    specialInstructions: '',
    followupRequired: false,
    
    // Pre-procedure Requirements
    fastingStatus: false,
    currentMedications: '',
    bloodThinners: false
  });
  const [errors, setErrors] = useState({});

  const serviceOptions = [
    { value: 'Endoscopy', label: 'Endoscopy', price: 999 },
    { value: 'SIBO Test', label: 'SIBO Test', price: 499 },
    { value: 'Complete Health Checkup', label: 'Complete Health Checkup', price: 599 }
  ];

  const timeSlots = campService.getAvailableTimeSlots();

  useEffect(() => {
    fetchCamp();
  }, [campId]);

  const fetchCamp = async () => {
    try {
      setLoading(true);
      const response = await campService.getCampById(campId);
      setCamp(response);
    } catch (error) {
      console.error('Error fetching camp:', error);
      toast.error('Failed to fetch camp details');
      navigate('/camps');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleServiceChange = (service, checked) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: checked 
        ? [...prev.selectedServices, service]
        : prev.selectedServices.filter(s => s !== service)
    }));
  };

  const calculateTotalAmount = () => {
    return campService.calculateTotalAmount(formData.selectedServices);
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic Information
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid mobile number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.emergencyContactName.trim()) {
      newErrors.emergencyContactName = 'Emergency contact name is required';
    }

    if (!formData.emergencyContactNumber.trim()) {
      newErrors.emergencyContactNumber = 'Emergency contact number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.emergencyContactNumber)) {
      newErrors.emergencyContactNumber = 'Please enter a valid emergency contact number';
    }

    // Service Selection
    if (formData.selectedServices.length === 0) {
      newErrors.selectedServices = 'Please select at least one service';
    }

    // Consent
    if (!formData.consentForProcedures) {
      newErrors.consentForProcedures = 'Consent for procedures is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      setSubmitting(true);

      const submitData = {
        campId,
        ...formData,
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : null,
        age: formData.age ? parseInt(formData.age) : null
      };

      await campService.createCampRegistration(submitData);
      toast.success('Registration submitted successfully');
      navigate(`/camps/${campId}`);
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error('Failed to submit registration');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!camp) {
    return (
      <Alert severity="error">
        Camp not found or no longer available.
      </Alert>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/camps/${campId}`)}
            sx={{ mr: 2 }}
          >
            Back to Camp
          </Button>
          <Typography variant="h4" component="h1">
            Camp Registration
          </Typography>
        </Box>

        {/* Camp Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📅 {camp.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              📍 {camp.venue} • {new Date(camp.date).toLocaleDateString()} • {camp.startTime} - {camp.endTime}
            </Typography>
          </CardContent>
        </Card>

        {/* Registration Form */}
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Basic Patient Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    👤 Basic Patient Information
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <DatePicker
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={(date) => handleInputChange('dateOfBirth', date)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                    maxDate={new Date()}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    inputProps={{ min: 1, max: 120 }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth required error={!!errors.gender}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={formData.gender}
                      label="Gender"
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    >
                      <MenuItem value="MALE">Male</MenuItem>
                      <MenuItem value="FEMALE">Female</MenuItem>
                      <MenuItem value="OTHER">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                    error={!!errors.mobileNumber}
                    helperText={errors.mobileNumber}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Email ID (Optional)"
                    type="email"
                    value={formData.emailId}
                    onChange={(e) => handleInputChange('emailId', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    error={!!errors.address}
                    helperText={errors.address}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Emergency Contact Name"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                    error={!!errors.emergencyContactName}
                    helperText={errors.emergencyContactName}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Emergency Contact Number"
                    value={formData.emergencyContactNumber}
                    onChange={(e) => handleInputChange('emergencyContactNumber', e.target.value)}
                    error={!!errors.emergencyContactNumber}
                    helperText={errors.emergencyContactNumber}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Service Selection */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    🏥 Service Selection (Required)
                  </Typography>
                  {errors.selectedServices && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {errors.selectedServices}
                    </Alert>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <FormGroup>
                    {serviceOptions.map((service) => (
                      <FormControlLabel
                        key={service.value}
                        control={
                          <Checkbox
                            checked={formData.selectedServices.includes(service.value)}
                            onChange={(e) => handleServiceChange(service.value, e.target.checked)}
                          />
                        }
                        label={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography>{service.label}</Typography>
                            <Chip label={`₹${service.price}`} size="small" color="primary" />
                          </Box>
                        }
                      />
                    ))}
                  </FormGroup>
                </Grid>

                {formData.selectedServices.length > 0 && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Total Amount: ₹{calculateTotalAmount()}</strong>
                      </Typography>
                    </Alert>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/camps/${campId}`)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Registration'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};

export default CampRegistrationPage;
