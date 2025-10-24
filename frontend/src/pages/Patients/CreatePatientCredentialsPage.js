import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Save, Copy, Visibility, VisibilityOff } from '@mui/icons-material';
import toast from 'react-hot-toast';
import api from '../../services/api';

const CreatePatientCredentialsPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState([]);
  const [showPassword, setShowPassword] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      toast.error('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Invalid email format');
      return false;
    }
    if (!formData.password.trim()) {
      toast.error('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleCreateCredentials = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: 'PATIENT'
      });

      if (response.data.success || response.status === 201) {
        const newCredential = {
          id: Date.now(),
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          createdAt: new Date().toLocaleString(),
        };

        setCreatedCredentials(prev => [newCredential, ...prev]);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
        });

        toast.success('Patient credentials created successfully!');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Failed to create credentials';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Create Patient Credentials
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Generate Login Credentials for Patients
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              fullWidth
              placeholder="e.g., Rajesh"
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              fullWidth
              placeholder="e.g., Kumar"
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              placeholder="e.g., patient@example.com"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              placeholder="Min 6 characters"
            />
          </Box>

          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleCreateCredentials}
            disabled={loading}
            fullWidth
            sx={{ backgroundColor: '#1B8A8A' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Credentials'}
          </Button>
        </CardContent>
      </Card>

      {createdCredentials.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Created Credentials ({createdCredentials.length})
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Password</strong></TableCell>
                    <TableCell><strong>Created</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {createdCredentials.map((cred) => (
                    <TableRow key={cred.id}>
                      <TableCell>{cred.firstName} {cred.lastName}</TableCell>
                      <TableCell>{cred.email}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{showPassword[cred.id] ? cred.password : '••••••'}</span>
                          <Button
                            size="small"
                            onClick={() => togglePasswordVisibility(cred.id)}
                          >
                            {showPassword[cred.id] ? <VisibilityOff /> : <Visibility />}
                          </Button>
                        </Box>
                      </TableCell>
                      <TableCell>{cred.createdAt}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<Copy />}
                          onClick={() => handleCopyToClipboard(`Email: ${cred.email}\nPassword: ${cred.password}`)}
                        >
                          Copy
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default CreatePatientCredentialsPage;

