import { useState, useEffect } from 'react';
import { checkServerConnection } from '../api/config';
import '../assets/css/ConnectionStatus.css';

export default function ConnectionStatus() {
    const [isConnected, setIsConnected] = useState(true);
    const [isChecking, setIsChecking] = useState(false);

    const checkConnection = async () => {
        setIsChecking(true);
        try {
            const connected = await checkServerConnection();
            setIsConnected(connected);
        } catch (error) {
            setIsConnected(false);
        } finally {
            setIsChecking(false);
        }
    };

    useEffect(() => {
        // Проверяем подключение при монтировании компонента
        checkConnection();

        // Проверяем подключение каждые 30 секунд
        const interval = setInterval(checkConnection, 30000);

        return () => clearInterval(interval);
    }, []);

    if (isConnected) {
        return null;
    }

    return (
        <div className="connection-status">
            <div className="connection-content">
                <div className="connection-icon">⚠️</div>
                <div className="connection-message">
                    <h3>Проблема с подключением</h3>
                    <p>Не удалось подключиться к серверу. Пожалуйста, проверьте:</p>
                    <ul>
                        <li>Запущен ли бэкенд на порту 8080</li>
                        <li>Ваше интернет-соединение</li>
                        <li>Настройки брандмауэра или VPN</li>
                    </ul>
                </div>
                <button 
                    onClick={checkConnection} 
                    className="retry-btn"
                    disabled={isChecking}
                >
                    {isChecking ? 'Проверка...' : 'Попробовать снова'}
                </button>
            </div>
        </div>
    );
} 