import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.svg"; 
import "../assets/css/Login.css";
import { authAPI } from "../api/auth";

export default function LoginPage() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await authAPI.login(credentials);
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при входе');
        }
    };

    return (
        <div className="login-container">
            <div className="logo-container">
                <img
                    src={logo}
                    alt="Логотип"
                    className="login-logo"
                    onClick={() => navigate("/")}
                    style={{ cursor: 'pointer' }}
                />
            </div>

            <form onSubmit={handleLogin} className="auth-form">
                <h2>Вход</h2>
                {error && <div className="error-message">{error}</div>}
                <input
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Логин"
                    required
                />
                <input
                    name="password"
                    type="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Пароль"
                    required
                />
                <button type="submit">Войти</button>
            </form>
        </div>
    );
}
