import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';

// Import components
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/Common/LoadingSpinner';

// Import pages
import LoginPage from './pages/Auth/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PatientListPage from './pages/Patients/PatientListPage';
import PatientDetailPage from './pages/Patients/PatientDetailPage';
import PatientFormPage from './pages/Patients/PatientFormPage';
import InvestigationListPage from './pages/Investigations/InvestigationListPage';
import InvestigationFormPage from './pages/Investigations/InvestigationFormPage';
import TreatmentListPage from './pages/Treatments/TreatmentListPage';
import TreatmentFormPage from './pages/Treatments/TreatmentFormPage';
import SurgeryListPage from './pages/Surgery/SurgeryListPage';
import SurgeryFormPage from './pages/Surgery/SurgeryFormPage';
import LiverTransplantListPage from './pages/LiverTransplant/LiverTransplantListPage';
import LiverTransplantFormPage from './pages/LiverTransplant/LiverTransplantFormPage';
import FollowUpListPage from './pages/FollowUp/FollowUpListPage';
import FollowUpFormPage from './pages/FollowUp/FollowUpFormPage';
import NotFoundPage from './pages/Error/NotFoundPage';

// Import Redux actions
import { setUserFromStorage } from './store/slices/authSlice';
import authService from './services/authService';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize user from localStorage if available on app start
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      dispatch(setUserFromStorage(storedUser));
    } else {
      // For demo purposes, create a demo user if none exists
      const demoUser = {
        id: 'demo-user-id',
        email: 'doctor@medical.com',
        firstName: 'Dr. John',
        lastName: 'Doe',
        role: 'DOCTOR',
        isActive: true
      };
      const demoToken = 'demo-jwt-token';

      // Store demo user and token
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('token', demoToken);
      dispatch(setUserFromStorage(demoUser));
    }
    setIsInitialized(true);
  }, []); // Empty dependency array - only run once

  // Show loading until initialization is complete
  if (!isInitialized) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <LoadingSpinner size={60} />
      </Box>
    );
  }

  // Simple authentication check
  const isAuthenticated = authService.isAuthenticated() && user;

  return (
    <Routes>
      {/* Login route */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />

      {/* Protected routes - only render if authenticated */}
      {isAuthenticated ? (
        <Route path="/" element={<Layout />}>
          {/* Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Patients */}
          <Route path="patients" element={<PatientListPage />} />
          <Route path="patients/new" element={<PatientFormPage />} />
          <Route path="patients/:id" element={<PatientDetailPage />} />
          <Route path="patients/:id/edit" element={<PatientFormPage />} />

          {/* Investigations */}
          <Route path="investigations" element={<InvestigationListPage />} />
          <Route path="investigations/new" element={<InvestigationFormPage />} />
          <Route path="investigations/:id/edit" element={<InvestigationFormPage />} />

          {/* Treatments */}
          <Route path="treatments" element={<TreatmentListPage />} />
          <Route path="treatments/new" element={<TreatmentFormPage />} />
          <Route path="treatments/:id/edit" element={<TreatmentFormPage />} />

          {/* Surgery */}
          <Route path="surgery" element={<SurgeryListPage />} />
          <Route path="surgery/new" element={<SurgeryFormPage />} />
          <Route path="surgery/:id/edit" element={<SurgeryFormPage />} />

          {/* Liver Transplant */}
          <Route path="liver-transplant" element={<LiverTransplantListPage />} />
          <Route path="liver-transplant/new" element={<LiverTransplantFormPage />} />
          <Route path="liver-transplant/:id/edit" element={<LiverTransplantFormPage />} />

          {/* Follow-up */}
          <Route path="follow-up" element={<FollowUpListPage />} />
          <Route path="follow-up/new" element={<FollowUpFormPage />} />
          <Route path="follow-up/:id/edit" element={<FollowUpFormPage />} />

          {/* 404 for authenticated users */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      ) : null}

      {/* Catch all - redirect to login if not authenticated */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
