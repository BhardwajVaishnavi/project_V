import api from './api';

const authService = {
  // Register user
  register: async (userData) => {
    try {
      console.log('📝 Attempting registration with:', { email: userData.email });
      const response = await api.post('/auth/register', userData);
      console.log('📝 Registration response:', response);

      if (response.success && response.data) {
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        console.log('✅ Registration successful, stored user and token');
      }

      return response;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  },

  // Login user
  login: async (userData) => {
    try {
      console.log('🔐 Attempting login with:', { email: userData.email });
      const response = await api.post('/auth/login', userData);
      console.log('🔐 Login response:', response);

      if (response.success && response.data) {
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        console.log('✅ Login successful, stored user and token');
      }

      return response;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    
    if (response.success && response.data) {
      // Update user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      return false;
    }

    // Check if token is expired
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (tokenPayload.exp < currentTime) {
        console.log('🔒 Token has expired, clearing session');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Error checking token expiry:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  },

  // Get stored user
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get stored token
  getStoredToken: () => {
    return localStorage.getItem('token');
  },

  // Check user role
  hasRole: (requiredRole) => {
    const user = authService.getStoredUser();
    if (!user) return false;
    
    // Define role hierarchy
    const roleHierarchy = {
      ADMIN: 4,
      DOCTOR: 3,
      NURSE: 2,
      STAFF: 1,
    };
    
    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
  },

  // Check if user has any of the specified roles
  hasAnyRole: (roles) => {
    return roles.some(role => authService.hasRole(role));
  },

  // Check if token is about to expire (within 5 minutes)
  isTokenExpiringSoon: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const fiveMinutesFromNow = currentTime + (5 * 60); // 5 minutes in seconds

      return tokenPayload.exp < fiveMinutesFromNow;
    } catch (error) {
      return false;
    }
  },

  // Refresh token by re-authenticating
  refreshToken: async () => {
    try {
      const user = authService.getStoredUser();
      if (!user) {
        throw new Error('No user found for token refresh');
      }

      // For now, we'll just check if the current token is still valid
      // In a real app, you'd call a refresh endpoint
      const response = await api.get('/auth/me');

      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      authService.logout();
      throw error;
    }
  },
};

export default authService;
