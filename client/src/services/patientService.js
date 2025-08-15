import api, { buildPaginationParams } from './api';

const patientService = {
  // Get all patients with pagination and filters
  getPatients: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      search = '',
      sex = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const queryParams = buildPaginationParams(page, limit, {
      search,
      sex,
      sortBy,
      sortOrder,
    });

    const response = await api.get(`/patients?${queryParams}`);
    return response.data;
  },

  // Get patient by ID
  getPatientById: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  // Create new patient
  createPatient: async (patientData) => {
    try {
      console.log('🌐 API: Creating patient with data:', patientData);
      const response = await api.post('/patients', patientData);
      console.log('✅ API: Patient created successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ API: Patient creation failed:', error);
      console.error('📋 API Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Update patient
  updatePatient: async (id, patientData) => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },

  // Delete patient (soft delete)
  deletePatient: async (id) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },

  // Get search suggestions
  getSearchSuggestions: async (query) => {
    if (!query || query.length < 2) {
      return { suggestions: [] };
    }
    
    const response = await api.get(`/patients/search/suggestions?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Helper function to calculate age
  calculateAge: (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  },

  // Helper function to calculate BMI
  calculateBMI: (height, weight) => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
  },

  // Helper function to format patient name
  formatPatientName: (patient) => {
    return `${patient.firstName} ${patient.lastName}`;
  },

  // Helper function to format patient display info
  formatPatientInfo: (patient) => {
    const age = patientService.calculateAge(patient.dateOfBirth);
    return {
      ...patient,
      fullName: patientService.formatPatientName(patient),
      age,
      displayInfo: `${patient.firstName} ${patient.lastName} (${age}y, ${patient.sex})`,
    };
  },

  // Validate patient data
  validatePatientData: (patientData) => {
    const errors = [];

    // Required fields
    if (!patientData.firstName?.trim()) {
      errors.push('First name is required');
    }
    if (!patientData.lastName?.trim()) {
      errors.push('Last name is required');
    }
    if (!patientData.dateOfBirth) {
      errors.push('Date of birth is required');
    }
    if (!patientData.sex) {
      errors.push('Sex is required');
    }
    if (!patientData.mobile?.trim()) {
      errors.push('Mobile number is required');
    }

    // Validate mobile number (Indian format)
    if (patientData.mobile && !/^[6-9]\d{9}$/.test(patientData.mobile)) {
      errors.push('Please enter a valid 10-digit mobile number');
    }

    // Validate Aadhar number
    if (patientData.aadharNumber && !/^\d{12}$/.test(patientData.aadharNumber)) {
      errors.push('Aadhar number must be 12 digits');
    }

    // Validate email
    if (patientData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Validate age (must be reasonable)
    if (patientData.dateOfBirth) {
      const age = patientService.calculateAge(patientData.dateOfBirth);
      if (age < 0 || age > 150) {
        errors.push('Please enter a valid date of birth');
      }
    }

    // Validate height and weight
    if (patientData.height && (patientData.height < 50 || patientData.height > 250)) {
      errors.push('Height must be between 50 and 250 cm');
    }
    if (patientData.weight && (patientData.weight < 10 || patientData.weight > 300)) {
      errors.push('Weight must be between 10 and 300 kg');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

export default patientService;
