import api from './api';

// Generate sales pitch
export const generatePitch = async (pitchData) => {
  const response = await api.post('/pitch/generate', pitchData);
  return response.data;
};

// Get pitch history
export const getPitchHistory = async () => {
  const response = await api.get('/pitch/history');
  return response.data;
};

// Get pitch by ID
export const getPitchById = async (id) => {
  const response = await api.get(`/pitch/${id}`);
  return response.data;
};
