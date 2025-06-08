import api from './config';

export const exerciseAPI = {
  getAll: async () => {
    const res = await api.get('/exercises');
    return res.data;
  },
  add: async (exercise) => {
    return api.post('/exercises', exercise);
  },
  update: async (id, exercise) => {
    return api.put(`/exercises/${id}`, exercise);
  },
  delete: async (id) => {
    return api.delete(`/exercises/${id}`);
  }
}; 