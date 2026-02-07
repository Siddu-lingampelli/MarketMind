import api from './api';

// Generate marketing campaign
export const generateCampaign = async (campaignData) => {
  const response = await api.post('/campaign/generate', campaignData);
  return response.data;
};

// Get campaign history
export const getCampaignHistory = async () => {
  const response = await api.get('/campaign/history');
  return response.data;
};

// Get campaign by ID
export const getCampaignById = async (id) => {
  const response = await api.get(`/campaign/${id}`);
  return response.data;
};
