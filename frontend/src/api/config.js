import axios from 'axios';

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
    // Замените на URL вашего Spring бэкенда
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    // Добавляем таймаут в 10 секунд
    timeout: 10000,
    // Разрешаем переиспользование соединения
    keepAlive: true,
    // Увеличиваем максимальное количество одновременных запросов
    maxConcurrentRequests: 5,
});

// Добавляем перехватчик для добавления токена авторизации
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request configuration error:', error);
        return Promise.reject(error);
    }
);

// Добавляем перехватчик для обработки ошибок
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            // Таймаут запроса
            console.error('Request timeout');
            throw new Error('Превышено время ожидания ответа от сервера. Пожалуйста, проверьте ваше интернет-соединение и попробуйте снова.');
        }

        if (!error.response) {
            if (error.message === 'Network Error') {
                // Ошибка сети
                console.error('Network error - no connection to server');
                throw new Error('Не удалось подключиться к серверу. Пожалуйста, проверьте:\n' +
                    '1. Запущен ли бэкенд на порту 8080\n' +
                    '2. Ваше интернет-соединение\n' +
                    '3. Настройки брандмауэра или VPN');
            }
            // Другие ошибки без ответа
            console.error('No response received:', error.message);
            throw new Error('Не удалось получить ответ от сервера. Пожалуйста, попробуйте позже.');
        }

        // Обработка ошибок с ответом от сервера
        switch (error.response.status) {
            case 401:
                // Неавторизованный доступ
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/login';
                throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
            case 403:
                // Доступ запрещен
                if (window.location.pathname.startsWith('/coach')) {
                    window.location.href = '/profile';
                }
                throw new Error('Доступ запрещен. У вас нет прав для выполнения этого действия.');
            case 404:
                // Ресурс не найден
                console.error('Resource not found:', error.response.config.url);
                throw new Error('Запрашиваемый ресурс не найден.');
            case 500:
                // Серверная ошибка
                console.error('Server error:', error.response.data);
                throw new Error('Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.');
            case 503:
                // Сервис недоступен
                console.error('Service unavailable:', error.response.data);
                throw new Error('Сервис временно недоступен. Пожалуйста, попробуйте позже.');
            default:
                console.error('API error:', error.response.data);
                throw new Error(error.response.data?.message || 'Произошла ошибка при выполнении запроса.');
        }
    }
);

// Функция для проверки доступности сервера
export const checkServerConnection = async () => {
    try {
        await api.get('/health', { timeout: 5000 });
        return true;
    } catch (error) {
        console.error('Server connection check failed:', error);
        return false;
    }
};

export default api; 