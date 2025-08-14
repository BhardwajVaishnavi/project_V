import api, { buildPaginationParams } from './api';

const liverTransplantService = {
  getEvaluations: async (params = {}) => {
    const queryParams = buildPaginationParams(params.page, params.limit, params);
    const response = await api.get(`/liver-transplant/evaluations?${queryParams}`);
    return response.data;
  },

  getEvaluationById: async (id) => {
    const response = await api.get(`/liver-transplant/evaluations/${id}`);
    return response.data;
  },

  createEvaluation: async (evaluationData) => {
    const response = await api.post('/liver-transplant/evaluations', evaluationData);
    return response.data;
  },

  updateEvaluation: async (id, evaluationData) => {
    const response = await api.put(`/liver-transplant/evaluations/${id}`, evaluationData);
    return response.data;
  },

  deleteEvaluation: async (id) => {
    const response = await api.delete(`/liver-transplant/evaluations/${id}`);
    return response.data;
  },

  updateViralMarkers: async (id, viralMarkersData) => {
    const response = await api.post(`/liver-transplant/evaluations/${id}/viral-markers`, viralMarkersData);
    return response.data;
  },

  updateClearances: async (id, clearancesData) => {
    const response = await api.post(`/liver-transplant/evaluations/${id}/clearances`, clearancesData);
    return response.data;
  },

  updateTumorMarkers: async (id, tumorMarkersData) => {
    const response = await api.post(`/liver-transplant/evaluations/${id}/tumor-markers`, tumorMarkersData);
    return response.data;
  },

  getEvaluationProgress: async (id) => {
    const response = await api.get(`/liver-transplant/evaluations/${id}/progress`);
    return response.data;
  },
};

export default liverTransplantService;
