import api from './config';

export const authAPI = {
    // Регистрация
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', {
                username: userData.username,
                password: userData.password,
                name: userData.name,
                role: userData.role || 'USER'
            });
            return response.data;
        } catch (error) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Registration failed. Please try again.');
        }
    },

    // Вход
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', {
                username: credentials.username,
                password: credentials.password
            });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            if (response.data.role) {
                let role = response.data.role;
                if (role.startsWith('ROLE_')) role = role.substring(5);
                localStorage.setItem('role', role);
            }
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Invalid username or password');
            }
            throw new Error('Login failed. Please try again.');
        }
    },

    // Выход
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
    },

    // Получение данных пользователя
    getProfile: async () => {
        try {
            const response = await api.get('/auth/profile');
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                authAPI.logout();
            }
            throw new Error('Failed to load profile data');
        }
    },

    // Проверка роли пользователя
    isCoach: () => {
        return localStorage.getItem('role') === 'COACH';
    },

    // Проверка авторизации
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
}; 