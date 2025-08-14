import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Grid,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Search,
  Science,
  Edit,
  Visibility,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import LoadingSpinner from '../../components/Common/LoadingSpinner';

const InvestigationListPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
  });

  // Demo data for investigations
  const investigations = [
    {
      id: 1,
      patientName: 'John Smith',
      patientId: 'PAT001',
      investigationType: 'ULTRASONOGRAPHY',
      status: 'COMPLETED',
      date: new Date('2024-01-15'),
      findings: 'Liver shows signs of cirrhosis with irregular surface',
      createdAt: new Date('2024-01-10'),
    },
    {
      id: 2,
      patientName: 'Sarah Johnson',
      patientId: 'PAT002',
      investigationType: 'BLOOD_TEST',
      status: 'PENDING',
      date: new Date('2024-01-20'),
      findings: 'Pending blood work',
      createdAt: new Date('2024-01-18'),
    },
  ];

  const investigationTypes = [
    { value: '', label: 'All Types' },
    { value: 'ULTRASONOGRAPHY', label: 'Ultrasonography' },
    { value: 'CECT_ABDOMEN', label: 'CECT Abdomen' },
    { value: 'UPPER_GI_ENDOSCOPY', label: 'Upper GI Endoscopy' },
    { value: 'COLONOSCOPY', label: 'Colonoscopy' },
    { value: 'BLOOD_TEST', label: 'Blood Test' },
    { value: 'OTHER', label: 'Other' },
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'PENDING', label: 'Pending', color: 'warning' },
    { value: 'SCHEDULED', label: 'Scheduled', color: 'info' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'primary' },
    { value: 'COMPLETED', label: 'Completed', color: 'success' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'error' },
  ];

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'default';
  };

  const getInvestigationTypeLabel = (type) => {
    const typeOption = investigationTypes.find(option => option.value === type);
    return typeOption ? typeOption.label : type;
  };

  const columns = [
    {
      field: 'patientName',
      headerName: 'Patient',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Science color="primary" />
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {params.row.patientName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.patientId}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'investigationType',
      headerName: 'Investigation Type',
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2">
          {getInvestigationTypeLabel(params.value)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'date',
      headerName: 'Investigation Date',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? format(params.value, 'MMM dd, yyyy') : '-'}
        </Typography>
      ),
    },
    {
      field: 'findings',
      headerName: 'Findings',
      width: 250,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {params.value || 'No findings recorded'}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {format(params.value, 'MMM dd, yyyy')}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => navigate(`/investigations/${params.row.id}`)}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => navigate(`/investigations/${params.row.id}/edit`)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Investigations
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage patient investigations and diagnostic studies
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/investigations/new')}
          sx={{ height: 'fit-content' }}
        >
          New Investigation
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Search investigations..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Investigation Type"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                {investigationTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {option.value && (
                        <Chip
                          label=""
                          color={option.color}
                          size="small"
                          sx={{ width: 12, height: 12, minWidth: 12 }}
                        />
                      )}
                      {option.label}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Data Grid */}
      <Card>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={investigations}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            disableRowSelectionOnClick
            loading={isLoading}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
            }}
            slots={{
              loadingOverlay: () => (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <LoadingSpinner />
                </Box>
              ),
            }}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default InvestigationListPage;
