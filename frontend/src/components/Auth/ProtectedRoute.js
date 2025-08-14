import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import authService from '../../services/authService';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // Check if user is authenticated
  if (!authService.isAuthenticated() || !user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if required
  if (requiredRole && !authService.hasRole(requiredRole)) {
    // Redirect to dashboard if user doesn't have required role
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
