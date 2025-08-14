import api, { buildPaginationParams } from './api';

const surgeryService = {
  getSurgeries: async (params = {}) => {
    const queryParams = buildPaginationParams(params.page, params.limit, params);
    const response = await api.get(`/surgery?${queryParams}`);
    return response.data;
  },

  getSurgeryById: async (id) => {
    const response = await api.get(`/surgery/${id}`);
    return response.data;
  },

  createSurgery: async (surgeryData) => {
    const response = await api.post('/surgery', surgeryData);
    return response.data;
  },

  updateSurgery: async (id, surgeryData) => {
    const response = await api.put(`/surgery/${id}`, surgeryData);
    return response.data;
  },

  deleteSurgery: async (id) => {
    const response = await api.delete(`/surgery/${id}`);
    return response.data;
  },
};

export default surgeryService;
