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
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Person,
  Edit,
  Visibility,
  Delete,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import { getPatients, setFilters, deletePatient } from '../../store/slices/patientSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const PatientListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { patients, pagination, filters, isLoading } = useSelector(
    (state) => state.patients
  );

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  useEffect(() => {
    dispatch(
      getPatients({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        ...filters,
      })
    );
  }, [dispatch, paginationModel, filters]);

  const handleFilterChange = (field, value) => {
    dispatch(setFilters({ [field]: value }));
  };

  const handlePaginationModelChange = (newModel) => {
    setPaginationModel(newModel);
  };

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;

    try {
      await dispatch(deletePatient(patientToDelete.id)).unwrap();
      toast.success('Patient deleted successfully!');
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error || 'Failed to delete patient');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPatientToDelete(null);
  };

  const columns = [
    {
      field: 'serialNumber',
      headerName: 'S.No.',
      width: 70,
      sortable: false,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold">
          {params.api.getRowIndexRelativeToVisibleRows(params.id) + 1 + (paginationModel.page * paginationModel.pageSize)}
        </Typography>
      ),
    },
    {
      field: 'patientId',
      headerName: 'Patient ID',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} size="small" variant="outlined" color="primary" />
      ),
    },
    {
      field: 'fullName',
      headerName: 'Name',
      width: 180,
      valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 24, height: 24 }}>
            <Person fontSize="small" />
          </Avatar>
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'age',
      headerName: 'Age',
      width: 70,
      valueGetter: (params) => {
        if (params.row.dateOfBirth) {
          const today = new Date();
          const birthDate = new Date(params.row.dateOfBirth);
          return Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
        }
        return 'N/A';
      },
    },
    {
      field: 'sex',
      headerName: 'Sex',
      width: 80,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'MALE' ? 'primary' : 'secondary'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'mobile',
      headerName: 'Mobile',
      width: 130,
      renderCell: (params) => (
        <Typography variant="body2" fontFamily="monospace">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'city',
      headerName: 'City',
      width: 120,
    },
    {
      field: 'dateOfSurgery',
      headerName: 'Date of Surgery',
      width: 130,
      valueGetter: (params) => {
        // Get the most recent surgery date from surgeries array
        if (params.row.surgeries && params.row.surgeries.length > 0) {
          const latestSurgery = params.row.surgeries
            .filter(s => s.dateOfSurgery)
            .sort((a, b) => new Date(b.dateOfSurgery) - new Date(a.dateOfSurgery))[0];
          return latestSurgery?.dateOfSurgery;
        }
        return null;
      },
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? format(new Date(params.value), 'MMM dd, yyyy') : 'Not scheduled'}
        </Typography>
      ),
    },
    {
      field: 'transplantType',
      headerName: 'DDLT/LDLT',
      width: 100,
      renderCell: (params) => (
        params.value ? (
          <Chip
            label={params.value}
            size="small"
            color={params.value === 'DDLT' ? 'warning' : 'success'}
            variant="filled"
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            N/A
          </Typography>
        )
      ),
    },
    {
      field: 'meldScore',
      headerName: 'MELD Score',
      width: 100,
      renderCell: (params) => (
        params.value ? (
          <Chip
            label={params.value}
            size="small"
            color={
              params.value >= 25 ? 'error' :
              params.value >= 15 ? 'warning' :
              'success'
            }
            variant="filled"
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            N/A
          </Typography>
        )
      ),
    },
    {
      field: 'bloodGroup',
      headerName: 'Blood Group',
      width: 110,
      renderCell: (params) => (
        params.value ? (
          <Chip
            label={params.value}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Unknown
          </Typography>
        )
      ),
    },
    {
      field: 'nextFollowUp',
      headerName: 'Next Follow Up',
      width: 130,
      valueGetter: (params) => {
        // Get the next follow-up date from various sources
        if (params.row.followUps && params.row.followUps.length > 0) {
          const nextFollowUp = params.row.followUps
            .filter(f => new Date(f.followUpDate) > new Date())
            .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate))[0];
          return nextFollowUp?.followUpDate;
        }
        // Check surgery next follow up
        if (params.row.surgeries && params.row.surgeries.length > 0) {
          const latestSurgery = params.row.surgeries
            .filter(s => s.nextFollowUp)
            .sort((a, b) => new Date(b.dateOfSurgery || 0) - new Date(a.dateOfSurgery || 0))[0];
          return latestSurgery?.nextFollowUp;
        }
        return null;
      },
      renderCell: (params) => (
        <Typography variant="body2" color={params.value ? 'text.primary' : 'text.secondary'}>
          {params.value ? format(new Date(params.value), 'MMM dd, yyyy') : 'Not scheduled'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => navigate(`/patients/${params.row.id}`)}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => navigate(`/patients/${params.row.id}/edit`)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteClick(params.row)}
            >
              <Delete fontSize="small" />
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
            Patients
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage patient information and medical records
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/patients/new')}
          sx={{ height: 'fit-content' }}
        >
          Add Patient
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Search patients..."
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
                label="Sex"
                value={filters.sex}
                onChange={(e) => handleFilterChange('sex', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                select
                label="Sort By"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <MenuItem value="createdAt">Date Created</MenuItem>
                <MenuItem value="firstName">Name</MenuItem>
                <MenuItem value="dateOfVisit">Last Visit</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  dispatch(setFilters({ search: '', sex: '', sortBy: 'createdAt' }));
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Data Grid */}
      <Card>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={patients || []}
            columns={columns}
            getRowId={(row) => row?.id || Math.random()}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[5, 10, 25, 50]}
            rowCount={pagination?.totalCount || 0}
            paginationMode="server"
            loading={isLoading}
            disableRowSelectionOnClick
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Patient</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Are you sure you want to delete{' '}
            <strong>
              {patientToDelete?.firstName} {patientToDelete?.lastName}
            </strong>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientListPage;
