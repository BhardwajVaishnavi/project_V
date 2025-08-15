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
} from '@mui/material';
import {
  Save,
  ArrowBack,
  Science,
  Person,
  CalendarToday,
  CloudUpload,
  AttachFile,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import toast from 'react-hot-toast';

import {
  createInvestigation,
  updateInvestigation,
  getInvestigationById,
} from '../../store/slices/investigationSlice';
import { getSearchSuggestions } from '../../store/slices/patientSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

// Validation schema
const schema = yup.object({
  patientId: yup.string().required('Patient selection is required'),
  investigationType: yup.string().required('Investigation type is required'),
  status: yup.string().required('Status is required'),

  // General fields
  date: yup.date().nullable(),
  findings: yup.string().nullable(),
  reportUrl: yup.string().nullable(),

  // Specific investigation fields
  ultrasonographyDate: yup.date().nullable(),
  ultrasonographyFindings: yup.string().nullable(),
  ultrasonographyReportUrl: yup.string().nullable(),

  cectAbdomenDate: yup.date().nullable(),
  cectAbdomenFindings: yup.string().nullable(),
  cectAbdomenReportUrl: yup.string().nullable(),

  upperGIEndoscopyDate: yup.date().nullable(),
  upperGIEndoscopyFindings: yup.string().nullable(),
  upperGIEndoscopyReportUrl: yup.string().nullable(),

  endoscopicBiopsyDate: yup.date().nullable(),
  endoscopicBiopsyFindings: yup.string().nullable(),
  endoscopicBiopsyReportUrl: yup.string().nullable(),

  colonoscopyDate: yup.date().nullable(),
  colonoscopyFindings: yup.string().nullable(),
  colonoscopyReportUrl: yup.string().nullable(),

  colonoscopicBiopsyDate: yup.date().nullable(),
  colonoscopicBiopsyFindings: yup.string().nullable(),
  colonoscopicBiopsyReportUrl: yup.string().nullable(),

  petCtScanFindings: yup.string().nullable(),
  petCtScanReportUrl: yup.string().nullable(),

  otherBiopsyDate: yup.date().nullable(),
  otherBiopsyFindings: yup.string().nullable(),
  otherBiopsyReportUrl: yup.string().nullable(),
});

const investigationTypes = [
  { value: 'ULTRASONOGRAPHY', label: 'Ultrasonography' },
  { value: 'CECT_ABDOMEN', label: 'CECT Abdomen' },
  { value: 'UPPER_GI_ENDOSCOPY', label: 'Upper GI Endoscopy' },
  { value: 'ENDOSCOPIC_BIOPSY', label: 'Endoscopic Biopsy' },
  { value: 'COLONOSCOPY', label: 'Colonoscopy' },
  { value: 'COLONOSCOPIC_BIOPSY', label: 'Colonoscopic Biopsy' },
  { value: 'PET_CT_SCAN', label: 'PET CT Scan' },
  { value: 'OTHER_BIOPSY', label: 'Other Biopsy' },
  { value: 'BLOOD_TEST', label: 'Blood Test' },
  { value: 'URINE_TEST', label: 'Urine Test' },
  { value: 'IMAGING', label: 'Imaging Study' },
  { value: 'OTHER', label: 'Other' },
];

const statusOptions = [
  { value: 'PENDING', label: 'Pending', color: 'warning' },
  { value: 'SCHEDULED', label: 'Scheduled', color: 'info' },
  { value: 'COMPLETED', label: 'Completed', color: 'success' },
  { value: 'REVIEWED', label: 'Reviewed', color: 'primary' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'error' },
];

const InvestigationFormPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { currentInvestigation, isLoading } = useSelector((state) => state.investigations);
  const { searchSuggestions } = useSelector((state) => state.patients);
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
      patientId: '',
      investigationType: '',
      date: null,
      status: 'PENDING',
      findings: '',
      reportUrl: '',

      // Specific investigation fields
      ultrasonographyDate: null,
      ultrasonographyFindings: '',
      ultrasonographyReportUrl: '',

      cectAbdomenDate: null,
      cectAbdomenFindings: '',
      cectAbdomenReportUrl: '',

      upperGIEndoscopyDate: null,
      upperGIEndoscopyFindings: '',
      upperGIEndoscopyReportUrl: '',

      endoscopicBiopsyDate: null,
      endoscopicBiopsyFindings: '',
      endoscopicBiopsyReportUrl: '',

      colonoscopyDate: null,
      colonoscopyFindings: '',
      colonoscopyReportUrl: '',

      colonoscopicBiopsyDate: null,
      colonoscopicBiopsyFindings: '',
      colonoscopicBiopsyReportUrl: '',

      petCtScanFindings: '',
      petCtScanReportUrl: '',

      otherBiopsyDate: null,
      otherBiopsyFindings: '',
      otherBiopsyReportUrl: '',
    },
  });

  const selectedInvestigationType = watch('investigationType');

  useEffect(() => {
    if (isEdit && id) {
      dispatch(getInvestigationById(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentInvestigation) {
      reset({
        ...currentInvestigation,
        date: currentInvestigation.date ? new Date(currentInvestigation.date) : new Date(),
        ultrasonographyDate: currentInvestigation.ultrasonographyDate ? new Date(currentInvestigation.ultrasonographyDate) : null,
        cectAbdomenDate: currentInvestigation.cectAbdomenDate ? new Date(currentInvestigation.cectAbdomenDate) : null,
        upperGIEndoscopyDate: currentInvestigation.upperGIEndoscopyDate ? new Date(currentInvestigation.upperGIEndoscopyDate) : null,
        endoscopicBiopsyDate: currentInvestigation.endoscopicBiopsyDate ? new Date(currentInvestigation.endoscopicBiopsyDate) : null,
        colonoscopyDate: currentInvestigation.colonoscopyDate ? new Date(currentInvestigation.colonoscopyDate) : null,
        colonoscopicBiopsyDate: currentInvestigation.colonoscopicBiopsyDate ? new Date(currentInvestigation.colonoscopicBiopsyDate) : null,
        otherBiopsyDate: currentInvestigation.otherBiopsyDate ? new Date(currentInvestigation.otherBiopsyDate) : null,
      });
      if (currentInvestigation.patient) {
        setSelectedPatient(currentInvestigation.patient);
      }
    }
  }, [currentInvestigation, isEdit, reset]);

  const handlePatientSearch = async (searchTerm) => {
    if (searchTerm.length >= 2) {
      dispatch(getSearchSuggestions(searchTerm));
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setValue('patientId', patient.id);
  };

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        date: data.date?.toISOString(),
        ultrasonographyDate: data.ultrasonographyDate?.toISOString(),
        cectAbdomenDate: data.cectAbdomenDate?.toISOString(),
        upperGIEndoscopyDate: data.upperGIEndoscopyDate?.toISOString(),
        endoscopicBiopsyDate: data.endoscopicBiopsyDate?.toISOString(),
        colonoscopyDate: data.colonoscopyDate?.toISOString(),
        colonoscopicBiopsyDate: data.colonoscopicBiopsyDate?.toISOString(),
        otherBiopsyDate: data.otherBiopsyDate?.toISOString(),
      };

      if (isEdit) {
        await dispatch(updateInvestigation({ id, investigationData: formData })).unwrap();
        toast.success('Investigation updated successfully!');
      } else {
        await dispatch(createInvestigation(formData)).unwrap();
        toast.success('Investigation created successfully!');
      }

      navigate('/investigations');
    } catch (error) {
      toast.error(error || 'An error occurred');
    }
  };

  const renderSpecificInvestigationFields = () => {
    switch (selectedInvestigationType) {
      case 'ULTRASONOGRAPHY':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="ultrasonographyDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Ultrasonography Date"
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="ultrasonographyFindings"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Ultrasonography Findings"
                    multiline
                    rows={4}
                    placeholder="Enter detailed ultrasonography findings..."
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center' }}>
                <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Upload Report
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Upload ultrasonography report (PDF, JPG, PNG)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFile />}
                >
                  Choose File
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      // Handle file upload logic here
                      console.log('File selected:', e.target.files[0]);
                    }}
                  />
                </Button>
              </Box>
            </Grid>
          </Grid>
        );

      case 'CECT_ABDOMEN':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="cectAbdomenDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="CECT Abdomen Date"
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="cectAbdomenFindings"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="CECT Abdomen Findings"
                    multiline
                    rows={4}
                    placeholder="Enter detailed CECT abdomen findings..."
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 'UPPER_GI_ENDOSCOPY':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="upperGIEndoscopyDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Upper GI Endoscopy Date"
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="upperGIEndoscopyFindings"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Upper GI Endoscopy Findings"
                    multiline
                    rows={4}
                    placeholder="Enter detailed endoscopy findings..."
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 'COLONOSCOPY':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="colonoscopyDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Colonoscopy Date"
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="colonoscopyFindings"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Colonoscopy Findings"
                    multiline
                    rows={4}
                    placeholder="Enter detailed colonoscopy findings..."
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 'ENDOSCOPIC_BIOPSY':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="endoscopicBiopsyDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Endoscopic Biopsy Date"
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="endoscopicBiopsyFindings"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Endoscopic Biopsy Findings"
                    multiline
                    rows={4}
                    placeholder="Enter detailed biopsy findings..."
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 'COLONOSCOPIC_BIOPSY':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="colonoscopicBiopsyDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Colonoscopic Biopsy Date"
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="colonoscopicBiopsyFindings"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Colonoscopic Biopsy Findings"
                    multiline
                    rows={4}
                    placeholder="Enter detailed colonoscopic biopsy findings..."
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 'PET_CT_SCAN':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="petCtScanFindings"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="PET CT Scan Findings"
                    multiline
                    rows={4}
                    placeholder="Enter detailed PET CT scan findings..."
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 'OTHER_BIOPSY':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="otherBiopsyDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Other Biopsy Date"
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="otherBiopsyFindings"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Other Biopsy Findings"
                    multiline
                    rows={4}
                    placeholder="Enter detailed biopsy findings..."
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 'BLOOD_TEST':
      case 'URINE_TEST':
      case 'IMAGING':
      case 'OTHER':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Investigation Date"
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="findings"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Findings/Results"
                    multiline
                    rows={4}
                    placeholder="Enter detailed findings and results..."
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
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
          onClick={() => navigate('/investigations')}
          sx={{ mr: 2 }}
        >
          Back to Investigations
        </Button>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {isEdit ? 'Edit Investigation' : 'New Investigation'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update investigation details' : 'Order a new investigation for patient'}
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
                  onChange={(event, newValue) => {
                    if (newValue) {
                      handlePatientSelect(newValue);
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
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
                        <Typography variant="subtitle2">
                          {option.firstName} {option.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.patientId} • {option.age}y • {option.sex} • {option.mobile}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                />
              </Grid>

              {selectedPatient && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>Selected Patient:</strong> {selectedPatient.firstName} {selectedPatient.lastName}
                      ({selectedPatient.age}y, {selectedPatient.sex}) - {selectedPatient.patientId}
                    </Typography>
                  </Alert>
                </Grid>
              )}

              {/* Investigation Details */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom color="primary">
                  <Science sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Investigation Details
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="investigationType"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Investigation Type *"
                      error={!!errors.investigationType}
                      helperText={errors.investigationType?.message}
                    >
                      {investigationTypes.map((option) => (
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
                      {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Chip
                            label={option.label}
                            color={option.color}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Investigation Date"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          InputProps: {
                            startAdornment: <CalendarToday sx={{ mr: 1, color: 'action.active' }} />,
                          },
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* General Findings */}
              <Grid item xs={12}>
                <Controller
                  name="findings"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="General Findings"
                      multiline
                      rows={3}
                      placeholder="Enter general investigation findings..."
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="recommendations"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Recommendations"
                      multiline
                      rows={3}
                      placeholder="Enter recommendations based on findings..."
                    />
                  )}
                />
              </Grid>

              {/* Specific Investigation Fields */}
              {selectedInvestigationType && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom color="primary">
                      Specific {investigationTypes.find(t => t.value === selectedInvestigationType)?.label} Details
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {renderSpecificInvestigationFields()}
                  </Grid>
                </>
              )}

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/investigations')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingSpinner size={20} showMessage={false} color="inherit" />
                    ) : (
                      isEdit ? 'Update Investigation' : 'Save Investigation'
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InvestigationFormPage;
