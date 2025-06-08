import api from './config';

export const trainingsAPI = {
    // Получение своих тренировок
    getMyTrainings: async () => {
        const response = await api.get('/trainings/my');
        return response.data;
    },

    // Создание новой тренировки
    createTraining: async (trainingData) => {
        const response = await api.post('/trainings', {
            date: trainingData.date,
            exercises: trainingData.exercises.map(ex => ({
                exercise: { id: ex.exerciseId },
                sets: ex.sets,
                reps: ex.reps,
                weight: ex.weight
            }))
        });
        return response.data;
    },

    // Получение статистики по упражнению
    getExerciseStats: async (exerciseId) => {
        const response = await api.get(`/trainings/stats/${exerciseId}`);
        return response.data;
    }
}; 