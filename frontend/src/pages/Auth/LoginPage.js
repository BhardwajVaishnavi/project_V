import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  InputAdornment,
  IconButton,
  Link,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  LocalHospital,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

import { login, reset, clearError } from '../../store/slices/authSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

// Validation schema
const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(clearError());
    }

    if (isSuccess && user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      toast.success('Login successful!');
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, message, navigate, dispatch, location]);

  const onSubmit = (data) => {
    dispatch(login(data));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  mb: 2,
                }}
              >
                <LocalHospital sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                Medical System
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Patient Management Platform
              </Typography>
            </Box>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                {...register('email')}
                fullWidth
                label="Email Address"
                type="email"
                autoComplete="email"
                autoFocus
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                {...register('password')}
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                {isLoading ? (
                  <LoadingSpinner size={24} showMessage={false} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Demo Credentials */}
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight="medium" gutterBottom>
                  Demo Credentials:
                </Typography>
                <Typography variant="body2">
                  Email: doctor@medical.com<br />
                  Password: password123
                </Typography>
              </Alert>

              {/* Footer */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Need help? Contact{' '}
                  <Link href="#" color="primary">
                    IT Support
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
            © 2024 Medical Patient Management System. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
