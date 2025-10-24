import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import campService from '../../services/campService';

const CampListPage = () => {
  const navigate = useNavigate();
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchCamps();
  }, [pagination.currentPage, searchTerm, statusFilter]);

  const fetchCamps = async () => {
    try {
      setLoading(true);
      const response = await campService.getCamps({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        search: searchTerm,
        status: statusFilter,
        sortBy: 'date',
        sortOrder: 'desc'
      });

      setCamps(response.camps);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching camps:', error);
      toast.error('Failed to fetch camps');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, camp) => {
    setAnchorEl(event.currentTarget);
    setSelectedCamp(camp);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCamp(null);
  };

  const handleViewCamp = () => {
    navigate(`/camps/${selectedCamp.id}`);
    handleMenuClose();
  };

  const handleEditCamp = () => {
    navigate(`/camps/${selectedCamp.id}/edit`);
    handleMenuClose();
  };

  const handleDeleteCamp = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    try {
      await campService.deleteCamp(selectedCamp.id);
      toast.success('Camp deleted successfully');
      fetchCamps();
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Failed to delete camp');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'COMPLETED': return 'info';
      case 'CANCELLED': return 'error';
      case 'POSTPONED': return 'warning';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          🏕️ Camp Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/camps/new')}
        >
          Create New Camp
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search camps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                  <MenuItem value="POSTPONED">Postponed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                Total: {pagination.totalItems} camps
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Camps Grid */}
      {camps.length === 0 ? (
        <Alert severity="info">
          No camps found. Create your first camp to get started.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {camps.map((camp) => (
            <Grid item xs={12} sm={6} md={4} key={camp.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 4
                  }
                }}
                onClick={() => navigate(`/camps/${camp.id}`)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" component="h2" noWrap>
                      {camp.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e, camp);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Box display="flex" alignItems="center" mb={1}>
                    <EventIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(camp.date)} • {formatTime(camp.startTime)} - {formatTime(camp.endTime)}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {camp.venue}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <PeopleIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {camp.currentRegistrations} / {camp.maxCapacity || '∞'} registered
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip
                      label={camp.status}
                      color={getStatusColor(camp.status)}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Created by {camp.createdBy.firstName} {camp.createdBy.lastName}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewCamp}>
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEditCamp}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Camp
        </MenuItem>
        <MenuItem onClick={handleDeleteCamp} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Camp
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Camp</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedCamp?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CampListPage;
