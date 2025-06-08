import api from './config';

export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/me');
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/user/stats');
    return response.data;
  },
  updateProfile: async (profile) => {
    return api.put('/user/me', profile);
  },
  updateStats: async (stats) => {
    return api.put('/user/stats', stats);
  },
  searchByName: async (name) => {
    const res = await api.get(`/user/search?name=${encodeURIComponent(name)}`);
    return res.data;
  },
  getAll: async () => {
    const res = await api.get('/user/all');
    return res.data;
  }
}; 