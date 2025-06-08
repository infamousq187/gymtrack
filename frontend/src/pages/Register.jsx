import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.svg"; 
import "../assets/css/Register.css";
import { authAPI } from "../api/auth";

export default function RegisterPage() {
    const [form, setForm] = useState({ username: '', password: '', name: '', role: 'USER' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Отправка данных регистрации:', form);
            const response = await authAPI.register(form);
            console.log('Ответ от сервера:', response);
            navigate('/login');
        } catch (err) {
            console.error('Ошибка при регистрации:', err);
            setError(err.response?.data?.message || 'Ошибка при регистрации');
        }
    };

    return (
        <div className="register-container">
            <div className="logo-container">
                <img
                    src={logo}
                    alt="Логотип"
                    className="register-logo"
                    onClick={() => navigate("/")}
                    style={{ cursor: 'pointer' }}
                />
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Регистрация</h2>
                {error && <div className="error-message">{error}</div>}
                <input 
                    name="username" 
                    value={form.username} 
                    onChange={handleChange} 
                    placeholder="Логин" 
                    required 
                />
                <input 
                    name="password" 
                    type="password" 
                    value={form.password} 
                    onChange={handleChange} 
                    placeholder="Пароль" 
                    required 
                />
                <input 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    placeholder="Имя" 
                    required 
                />
                <select 
                    name="role" 
                    value={form.role} 
                    onChange={handleChange}
                    className="role-select"
                >
                    <option value="USER">Пользователь</option>
                    <option value="COACH">Тренер</option>
                    <option value="ADMIN">Админ</option>
                </select>
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
}

