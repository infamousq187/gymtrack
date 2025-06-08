import logo from '../img/logo.svg';
import { useEffect, useState } from 'react';
import { userAPI } from '../../api/user';
import { authAPI } from '../../api/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Header() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (authAPI.isAuthenticated()) {
        try {
          const userData = await userAPI.getProfile();
          setUser(userData);
          setError(null);
        } catch (err) {
          console.error('Failed to fetch profile:', err);
          setError('Failed to load profile data');
          setUser(null);
        }
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleExercisesAdmin = () => {
    navigate('/exercises');
  };

  const role = localStorage.getItem('role');
  const isCoach = authAPI.isCoach();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <nav className="nav">
          <Link to="/" className="menu-btn">Главная</Link>
          {user && <Link to="/trainings" className="menu-btn">Тренировки</Link>}
          {user && <Link to="/trainings/create" className="menu-btn">Создать тренировку</Link>}
          {user && <Link to="/trainings/my" className="menu-btn">Мои тренировки</Link>}
          {isCoach && (
            <Link to="/coach/training/create" className="menu-btn">Тренировка для пользователя</Link>
          )}
          {isCoach && (
            <button onClick={handleExercisesAdmin} className="menu-btn">Управление упражнениями</button>
          )}
          {user && !isCoach && (
            <button onClick={handleExercisesAdmin} className="menu-btn">Упражнения</button>
          )}
        </nav>
        <div className="auth-links">
          {error && <span className="error-message">{error}</span>}
          {user ? (
            <>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <button onClick={handleProfile} className="menu-btn">Ваш профиль</button>
                <button onClick={handleLogout} className="menu-btn">Выход</button>
              </div>
              <span className="user-name">{user.name}</span>
            </>
          ) : (
            <>
              <Link to="/login" className="menu-btn">ВХОД</Link>
              <Link to="/register" className="menu-btn">РЕГИСТРАЦИЯ</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
