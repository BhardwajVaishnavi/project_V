import api, { buildPaginationParams } from './api';

const treatmentService = {
  getTreatments: async (params = {}) => {
    const queryParams = buildPaginationParams(params.page, params.limit, params);
    const response = await api.get(`/treatments?${queryParams}`);
    return response.data;
  },

  getTreatmentById: async (id) => {
    const response = await api.get(`/treatments/${id}`);
    return response.data;
  },

  createTreatment: async (treatmentData) => {
    const response = await api.post('/treatments', treatmentData);
    return response.data;
  },

  updateTreatment: async (id, treatmentData) => {
    const response = await api.put(`/treatments/${id}`, treatmentData);
    return response.data;
  },

  deleteTreatment: async (id) => {
    const response = await api.delete(`/treatments/${id}`);
    return response.data;
  },
};

export default treatmentService;
