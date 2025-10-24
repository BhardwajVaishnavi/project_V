import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Debug: Log token usage
      console.log('🔑 Using token for request:', config.url);
    } else {
      console.log('⚠️ No token found for request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Return the data directly for successful responses
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';

    // Debug: Log all API errors
    console.error('🚨 API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: message,
      data: error.response?.data
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      console.log('🔒 401 Unauthorized - clearing session');
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Use React Router navigation instead of window.location
      if (window.location.pathname !== '/login') {
        console.log('🔄 Redirecting to login page');
        window.location.replace('/login');
        toast.error('Session expired. Please login again.');
      }
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found.');
    } else if (error.response?.status === 429) {
      toast.error('Too many requests. Please try again later.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'NETWORK_ERROR') {
      toast.error('Network error. Please check your connection.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle file uploads
export const createFormData = (data, fileField = 'file') => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (key === fileField && data[key]) {
      if (Array.isArray(data[key])) {
        // Multiple files
        data[key].forEach(file => {
          formData.append('files', file);
        });
      } else {
        // Single file
        formData.append('file', data[key]);
      }
    } else if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  
  return formData;
};

// Helper function to handle file uploads with progress
export const uploadWithProgress = (url, formData, onProgress) => {
  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Helper function to download files
export const downloadFile = async (url, filename) => {
  try {
    const response = await api.get(url, {
      responseType: 'blob',
    });
    
    // Create blob link to download
    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    window.URL.revokeObjectURL(link.href);
    
    return response;
  } catch (error) {
    toast.error('Failed to download file');
    throw error;
  }
};

// Helper function to format API errors
export const formatApiError = (error) => {
  if (error.response?.data?.errors) {
    // Validation errors
    return error.response.data.errors.map(err => err.msg).join(', ');
  }
  return error.response?.data?.message || error.message || 'An error occurred';
};

// Helper function to handle pagination params
export const buildPaginationParams = (page = 1, limit = 10, filters = {}) => {
  const params = new URLSearchParams();
  
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  Object.keys(filters).forEach(key => {
    if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });
  
  return params.toString();
};

export default api;
