import api, { buildPaginationParams } from './api';

const campService = {
  // Get all camps with pagination and filters
  getCamps: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      sortBy = 'date',
      sortOrder = 'desc',
    } = params;

    const queryParams = buildPaginationParams(page, limit, {
      search,
      status,
      sortBy,
      sortOrder,
    });

    const response = await api.get(`/camps?${queryParams}`);
    return response.data;
  },

  // Get camp by ID
  getCampById: async (id) => {
    const response = await api.get(`/camps/${id}`);
    return response.data;
  },

  // Create new camp
  createCamp: async (campData) => {
    try {
      console.log('🌐 API: Creating camp with data:', campData);
      const response = await api.post('/camps', campData);
      console.log('✅ API: Camp created successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ API: Camp creation failed:', error);
      throw error;
    }
  },

  // Update camp
  updateCamp: async (id, campData) => {
    try {
      console.log('🌐 API: Updating camp with data:', campData);
      const response = await api.put(`/camps/${id}`, campData);
      console.log('✅ API: Camp updated successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ API: Camp update failed:', error);
      throw error;
    }
  },

  // Delete camp
  deleteCamp: async (id) => {
    try {
      const response = await api.delete(`/camps/${id}`);
      console.log('✅ API: Camp deleted successfully');
      return response;
    } catch (error) {
      console.error('❌ API: Camp deletion failed:', error);
      throw error;
    }
  },

  // Get camp registrations
  getCampRegistrations: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      search = '',
      campId = '',
      paymentStatus = '',
      priorityLevel = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const queryParams = buildPaginationParams(page, limit, {
      search,
      campId,
      paymentStatus,
      priorityLevel,
      sortBy,
      sortOrder,
    });

    const response = await api.get(`/camp-registrations?${queryParams}`);
    return response.data;
  },

  // Get camp registration by ID
  getCampRegistrationById: async (id) => {
    const response = await api.get(`/camp-registrations/${id}`);
    return response.data;
  },

  // Create new camp registration
  createCampRegistration: async (registrationData) => {
    try {
      console.log('🌐 API: Creating camp registration with data:', registrationData);
      const response = await api.post('/camp-registrations', registrationData);
      console.log('✅ API: Camp registration created successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ API: Camp registration creation failed:', error);
      throw error;
    }
  },

  // Update camp registration
  updateCampRegistration: async (id, registrationData) => {
    try {
      console.log('🌐 API: Updating camp registration with data:', registrationData);
      const response = await api.put(`/camp-registrations/${id}`, registrationData);
      console.log('✅ API: Camp registration updated successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ API: Camp registration update failed:', error);
      throw error;
    }
  },

  // Delete camp registration
  deleteCampRegistration: async (id) => {
    try {
      const response = await api.delete(`/camp-registrations/${id}`);
      console.log('✅ API: Camp registration deleted successfully');
      return response;
    } catch (error) {
      console.error('❌ API: Camp registration deletion failed:', error);
      throw error;
    }
  },

  // Get camp statistics
  getCampStatistics: async (campId) => {
    try {
      const response = await api.get(`/camps/${campId}/statistics`);
      return response.data;
    } catch (error) {
      console.error('❌ API: Failed to fetch camp statistics:', error);
      throw error;
    }
  },

  // Export camp registrations
  exportCampRegistrations: async (campId, format = 'csv') => {
    try {
      const response = await api.get(`/camps/${campId}/export?format=${format}`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('❌ API: Failed to export camp registrations:', error);
      throw error;
    }
  },

  // Service pricing
  getServicePricing: () => {
    return {
      'Endoscopy': 999,
      'SIBO Test': 499,
      'Complete Health Checkup': 599
    };
  },

  // Calculate total amount for selected services
  calculateTotalAmount: (selectedServices) => {
    const pricing = campService.getServicePricing();
    return selectedServices.reduce((total, service) => {
      return total + (pricing[service] || 0);
    }, 0);
  },

  // Get available time slots
  getAvailableTimeSlots: () => {
    return [
      '7:00 AM - 8:00 AM',
      '8:00 AM - 9:00 AM',
      '9:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM',
      '11:00 AM - 12:00 PM',
      '12:00 PM - 1:00 PM'
    ];
  },

  // Get camp status options
  getCampStatusOptions: () => {
    return [
      { value: 'ACTIVE', label: 'Active' },
      { value: 'COMPLETED', label: 'Completed' },
      { value: 'CANCELLED', label: 'Cancelled' },
      { value: 'POSTPONED', label: 'Postponed' }
    ];
  },

  // Get payment status options
  getPaymentStatusOptions: () => {
    return [
      { value: 'PAID', label: 'Paid' },
      { value: 'PENDING', label: 'Pending' },
      { value: 'FAILED', label: 'Failed' },
      { value: 'REFUNDED', label: 'Refunded' }
    ];
  },

  // Get priority level options
  getPriorityLevelOptions: () => {
    return [
      { value: 'HIGH', label: 'High' },
      { value: 'NORMAL', label: 'Normal' },
      { value: 'LOW', label: 'Low' }
    ];
  }
};

export default campService;
