import api from './api';

// Score lead
export const scoreLead = async (leadData) => {
  const response = await api.post('/lead/score', leadData);
  return response.data;
};

// Get lead history
export const getLeadHistory = async () => {
  const response = await api.get('/lead/history');
  return response.data;
};

// Get lead by ID
export const getLeadById = async (id) => {
  const response = await api.get(`/lead/${id}`);
  return response.data;
};

// Get lead statistics
export const getLeadStats = async () => {
  const response = await api.get('/lead/stats');
  return response.data;
};
