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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
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
  CheckCircle,
  Warning,
  Info,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

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

  // Liver Transplant Statistics
  const liverTransplantStats = [
    {
      title: 'Transplants This Year',
      value: '156',
      change: '+18%',
      icon: <LocalHospital />,
      color: '#2e7d32',
    },
    {
      title: 'Awaiting Transplant',
      value: '34',
      change: '+2%',
      icon: <Warning />,
      color: '#ed6c02',
    },
    {
      title: 'Post-Transplant Follow-up',
      value: '287',
      change: '+5%',
      icon: <CheckCircle />,
      color: '#1976d2',
    },
    {
      title: 'Donor Evaluations',
      value: '12',
      change: '+3%',
      icon: <Info />,
      color: '#9c27b0',
    },
  ];

  // Chart data for patient trends
  const patientTrendData = [
    { month: 'Jan', patients: 120, transplants: 8 },
    { month: 'Feb', patients: 145, transplants: 12 },
    { month: 'Mar', patients: 168, transplants: 15 },
    { month: 'Apr', patients: 192, transplants: 18 },
    { month: 'May', patients: 215, transplants: 22 },
    { month: 'Jun', patients: 234, transplants: 25 },
  ];

  // Chart data for transplant types
  const transplantTypeData = [
    { name: 'DDLT', value: 89, color: '#2e7d32' },
    { name: 'LDLT', value: 67, color: '#1976d2' },
  ];

  // Chart data for patient status
  const patientStatusData = [
    { status: 'Active', count: 234, color: '#2e7d32' },
    { status: 'Awaiting', count: 34, color: '#ed6c02' },
    { status: 'Completed', count: 156, color: '#1976d2' },
    { status: 'Inactive', count: 12, color: '#9c27b0' },
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

      {/* Liver Transplant Statistics */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Liver Transplant Program
        </Typography>
        <Grid container spacing={3}>
          {liverTransplantStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: stat.color,
                        mr: 2,
                        width: 40,
                        height: 40,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="success.main">
                    {stat.change}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Patient Trends Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Patient & Transplant Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={patientTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="patients"
                    stroke="#1976d2"
                    name="Total Patients"
                  />
                  <Line
                    type="monotone"
                    dataKey="transplants"
                    stroke="#2e7d32"
                    name="Transplants"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Transplant Type Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Transplant Type Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={transplantTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {transplantTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Patient Status Distribution */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Patient Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={patientStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" radius={[8, 8, 0, 0]}>
                    {patientStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
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
