import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Paper,
  IconButton,
} from '@mui/material';
import {
  People,
  Science,
  LocalHospital,
  EventNote,
  Add,
  TrendingUp,
  Person,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';

import { getUpcomingFollowUps } from '../../store/slices/followUpSlice';

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { upcomingFollowUps } = useSelector((state) => state.followUp);

  useEffect(() => {
    // Fetch upcoming follow-ups
    dispatch(getUpcomingFollowUps(7)); // Next 7 days
  }, [dispatch]);

  // Mock statistics - in real app, these would come from API
  const stats = [
    {
      title: 'Total Patients',
      value: '1,234',
      change: '+12%',
      icon: <People />,
      color: '#1976d2',
      path: '/patients',
    },
    {
      title: 'Pending Investigations',
      value: '45',
      change: '+5%',
      icon: <Science />,
      color: '#ed6c02',
      path: '/investigations',
    },
    {
      title: 'Active Treatments',
      value: '89',
      change: '+8%',
      icon: <LocalHospital />,
      color: '#2e7d32',
      path: '/treatments',
    },
    {
      title: 'Upcoming Follow-ups',
      value: upcomingFollowUps?.length || '0',
      change: 'This week',
      icon: <EventNote />,
      color: '#9c27b0',
      path: '/follow-up',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Patient',
      description: 'Register a new patient',
      icon: <People />,
      path: '/patients/new',
      color: '#1976d2',
    },
    {
      title: 'New Investigation',
      description: 'Order new investigation',
      icon: <Science />,
      path: '/investigations/new',
      color: '#ed6c02',
    },
    {
      title: 'Schedule Surgery',
      description: 'Plan new surgery',
      icon: <LocalHospital />,
      path: '/surgery/new',
      color: '#2e7d32',
    },
    {
      title: 'Liver Transplant Evaluation',
      description: 'Start new evaluation',
      icon: <EventNote />,
      path: '/liver-transplant/new',
      color: '#9c27b0',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'MISSED':
        return 'error';
      case 'CANCELLED':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {user?.firstName || 'Doctor'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening in your medical practice today.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate(stat.path)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: stat.color,
                      mr: 2,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ color: 'success.main', mr: 1, fontSize: 16 }} />
                  <Typography variant="body2" color="success.main">
                    {stat.change}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
                  Quick Actions
                </Typography>
                <Add color="primary" />
              </Box>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: action.color,
                          backgroundColor: 'action.hover',
                        },
                      }}
                      onClick={() => navigate(action.path)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar
                          sx={{
                            bgcolor: action.color,
                            width: 32,
                            height: 32,
                            mr: 2,
                          }}
                        >
                          {action.icon}
                        </Avatar>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {action.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Follow-ups */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
                  Upcoming Follow-ups
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => dispatch(getUpcomingFollowUps(7))}
                >
                  <Refresh />
                </IconButton>
              </Box>
              
              {upcomingFollowUps && upcomingFollowUps.length > 0 ? (
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {upcomingFollowUps.slice(0, 5).map((followUp) => (
                    <ListItem
                      key={followUp.id}
                      sx={{
                        cursor: 'pointer',
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                      onClick={() => navigate(`/follow-up/${followUp.id}/edit`)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${followUp.patient.firstName} ${followUp.patient.lastName}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(followUp.followUpDate), 'MMM dd, yyyy')}
                            </Typography>
                            <Chip
                              label={followUp.status}
                              size="small"
                              color={getStatusColor(followUp.status)}
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <EventNote sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    No upcoming follow-ups
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/follow-up/new')}
                  >
                    Schedule Follow-up
                  </Button>
                </Box>
              )}
              
              {upcomingFollowUps && upcomingFollowUps.length > 5 && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => navigate('/follow-up')}
                  >
                    View All Follow-ups
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
