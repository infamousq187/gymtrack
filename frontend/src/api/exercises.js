import api from './config';

export const exercisesAPI = {
    // Получить все упражнения (GET /api/exercises)
    getAll: async () => {
        const response = await api.get('/exercises');
        return response.data;
    },
    // Добавить упражнение (POST /api/exercises)
    add: async (exercise) => {
        const response = await api.post('/exercises', exercise);
        return response.data;
    },
    // Обновить упражнение (PUT /api/exercises/:id)
    update: async (id, exercise) => {
        const response = await api.put(`/exercises/${id}`, exercise);
        return response.data;
    },
    // Удалить упражнение (DELETE /api/exercises/:id)
    remove: async (id) => {
        await api.delete(`/exercises/${id}`);
    }
}; 