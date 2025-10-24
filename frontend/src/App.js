import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';

// Import components
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/Common/LoadingSpinner';

// Import pages
import LoginPage from './pages/Auth/LoginPage';
import LoginTestPage from './pages/Auth/LoginTestPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import PatientListPage from './pages/Patients/PatientListPage';
import PatientDetailPage from './pages/Patients/PatientDetailPage';
import PatientFormPage from './pages/Patients/PatientFormPage';
import CreatePatientCredentialsPage from './pages/Patients/CreatePatientCredentialsPage';
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
import CampListPage from './pages/Camps/CampListPage';
import CampFormPage from './pages/Camps/CampFormPage';
import CampRegistrationPage from './pages/Camps/CampRegistrationPage';
import SimpleCampForm from './pages/Camps/SimpleCampForm';
import CampTestPage from './pages/Camps/CampTestPage';
import NotFoundPage from './pages/Error/NotFoundPage';

// Import Redux actions
import { setUserFromStorage } from './store/slices/authSlice';
import authService from './services/authService';
import { performStartupChecks } from './utils/healthCheck';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 Initializing app...');

      // Perform startup checks
      const checks = await performStartupChecks();

      if (!checks.backend.healthy) {
        console.error('❌ Backend is not healthy:', checks.backend.error);
        // Clear any invalid tokens
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsInitialized(true);
        return;
      }

      // Initialize user from localStorage if available and valid
      if (checks.auth.authenticated) {
        console.log('✅ User is authenticated, setting user in store');
        dispatch(setUserFromStorage(checks.auth.user));
      } else {
        console.log('❌ User is not authenticated:', checks.auth.reason);
        // Clear any invalid tokens
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      setIsInitialized(true);
    };

    initializeApp();
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

      {/* Login test route (public) */}
      <Route path="/login-test" element={<LoginTestPage />} />

      {/* Protected routes - only render if authenticated */}
      {isAuthenticated ? (
        <Route path="/" element={<Layout />}>
          {/* Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Patients */}
          <Route path="patients" element={<PatientListPage />} />
          <Route path="patients/new" element={<PatientFormPage />} />
          <Route path="patients/credentials" element={<CreatePatientCredentialsPage />} />
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

          {/* Camps */}
          <Route path="camps" element={<CampListPage />} />
          <Route path="camps/new" element={<CampFormPage />} />
          <Route path="camps/simple" element={<SimpleCampForm />} />
          <Route path="camps/test" element={<CampTestPage />} />
          <Route path="camps/:id/edit" element={<CampFormPage />} />
          <Route path="camps/:campId/register" element={<CampRegistrationPage />} />

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
