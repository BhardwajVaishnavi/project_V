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
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import toast from 'react-hot-toast';
import campService from '../../services/campService';

const CampFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    venue: '',
    date: new Date(),
    startTime: '07:00',
    endTime: '13:00',
    description: '',
    maxCapacity: '',
    status: 'ACTIVE'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      fetchCamp();
    }
  }, [id, isEdit]);

  const fetchCamp = async () => {
    try {
      setLoading(true);
      const response = await campService.getCampById(id);
      const camp = response;
      
      setFormData({
        name: camp.name || '',
        venue: camp.venue || '',
        date: new Date(camp.date),
        startTime: camp.startTime || '07:00',
        endTime: camp.endTime || '13:00',
        description: camp.description || '',
        maxCapacity: camp.maxCapacity || '',
        status: camp.status || 'ACTIVE'
      });
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Camp name is required';
    }

    if (!formData.venue.trim()) {
      newErrors.venue = 'Venue is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.maxCapacity && (isNaN(formData.maxCapacity) || formData.maxCapacity < 1)) {
      newErrors.maxCapacity = 'Max capacity must be a positive number';
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
        ...formData,
        date: formData.date.toISOString(),
        maxCapacity: formData.maxCapacity ? parseInt(formData.maxCapacity) : null
      };

      if (isEdit) {
        await campService.updateCamp(id, submitData);
        toast.success('Camp updated successfully');
      } else {
        await campService.createCamp(submitData);
        toast.success('Camp created successfully');
      }

      navigate('/camps');
    } catch (error) {
      console.error('Error saving camp:', error);
      toast.error(isEdit ? 'Failed to update camp' : 'Failed to create camp');
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/camps')}
            sx={{ mr: 2 }}
          >
            Back to Camps
          </Button>
          <Typography variant="h4" component="h1">
            {isEdit ? 'Edit Camp' : 'Create New Camp'}
          </Typography>
        </Box>

        {/* Form */}
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Camp Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Venue"
                    value={formData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    error={!!errors.venue}
                    helperText={errors.venue}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <DatePicker
                    label="Camp Date"
                    value={formData.date}
                    onChange={(date) => handleInputChange('date', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.date}
                        helperText={errors.date}
                        required
                      />
                    )}
                    minDate={new Date()}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Start Time"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    error={!!errors.startTime}
                    helperText={errors.startTime}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="End Time"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    error={!!errors.endTime}
                    helperText={errors.endTime}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Max Capacity"
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => handleInputChange('maxCapacity', e.target.value)}
                    error={!!errors.maxCapacity}
                    helperText={errors.maxCapacity || 'Leave empty for unlimited capacity'}
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      label="Status"
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      <MenuItem value="ACTIVE">Active</MenuItem>
                      <MenuItem value="COMPLETED">Completed</MenuItem>
                      <MenuItem value="CANCELLED">Cancelled</MenuItem>
                      <MenuItem value="POSTPONED">Postponed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter camp description, special instructions, or additional information..."
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/camps')}
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
                      {submitting ? 'Saving...' : (isEdit ? 'Update Camp' : 'Create Camp')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        {/* Information Alert */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Camp Schedule:</strong> The default time is 7:00 AM - 1:00 PM as mentioned in your requirements. 
            You can adjust the timing as needed for each camp.
          </Typography>
        </Alert>
      </Box>
    </LocalizationProvider>
  );
};

export default CampFormPage;
