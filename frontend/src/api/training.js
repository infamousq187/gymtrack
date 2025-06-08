import api from './config';

export const trainingAPI = {
  getMy: async () => {
    console.log("Вызван trainingAPI.getMy");
    const res = await api.get('/trainings/my');
    return res.data;
  },
  add: async (training) => {
    return api.post('/trainings', training);
  },
  addForUser: async (training, userId) => {
    try {
      const response = await api.post(`/trainings/for-user?userId=${userId}`, training);
      return response.data;
    } catch (error) {
      console.error('Error in addForUser:', error.response?.data || error.message);
      throw new Error(error.response?.data || 'Failed to create training for user');
    }
  }
}; 