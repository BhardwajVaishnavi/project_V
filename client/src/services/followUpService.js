import api, { buildPaginationParams } from './api';

const followUpService = {
  getFollowUps: async (params = {}) => {
    const queryParams = buildPaginationParams(params.page, params.limit, params);
    const response = await api.get(`/follow-up?${queryParams}`);
    return response.data;
  },

  getFollowUpById: async (id) => {
    const response = await api.get(`/follow-up/${id}`);
    return response.data;
  },

  createFollowUp: async (followUpData) => {
    const response = await api.post('/follow-up', followUpData);
    return response.data;
  },

  updateFollowUp: async (id, followUpData) => {
    const response = await api.put(`/follow-up/${id}`, followUpData);
    return response.data;
  },

  deleteFollowUp: async (id) => {
    const response = await api.delete(`/follow-up/${id}`);
    return response.data;
  },

  getUpcomingFollowUps: async (days = 7) => {
    const response = await api.get(`/follow-up/upcoming?days=${days}`);
    return response.data;
  },
};

export default followUpService;
