import api, { buildPaginationParams } from './api';

const investigationService = {
  getInvestigations: async (params = {}) => {
    const queryParams = buildPaginationParams(params.page, params.limit, params);
    const response = await api.get(`/investigations?${queryParams}`);
    return response.data;
  },

  getInvestigationById: async (id) => {
    const response = await api.get(`/investigations/${id}`);
    return response.data;
  },

  createInvestigation: async (investigationData) => {
    const response = await api.post('/investigations', investigationData);
    return response.data;
  },

  updateInvestigation: async (id, investigationData) => {
    const response = await api.put(`/investigations/${id}`, investigationData);
    return response.data;
  },

  deleteInvestigation: async (id) => {
    const response = await api.delete(`/investigations/${id}`);
    return response.data;
  },
};

export default investigationService;
