import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { userAPI } from "../api/user";
import { authAPI } from "../api/auth";
import "../assets/css/Profile.css";

export default function Profile() {
    const [activeTab, setActiveTab] = useState("exercises");
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveError, setSaveError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [profileData, statsData] = await Promise.all([
                    userAPI.getProfile(),
                    userAPI.getStats()
                ]);
                setProfile(profileData);
                setStats(statsData);
            } catch (err) {
                console.error('Failed to fetch profile data:', err);
                setError('Не удалось загрузить данные профиля');
                if (err.response?.status === 401) {
                    authAPI.logout();
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const validateForm = () => {
        const errors = {};
        if (!profile?.name?.trim()) {
            errors.name = 'Имя обязательно для заполнения';
        }
        if (stats?.height && (stats.height < 100 || stats.height > 250)) {
            errors.height = 'Рост должен быть от 100 до 250 см';
        }
        if (stats?.weight && (stats.weight < 30 || stats.weight > 300)) {
            errors.weight = 'Вес должен быть от 30 до 300 кг';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
        // Очищаем ошибку валидации при изменении поля
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleStatsChange = (e) => {
        const { name, value } = e.target;
        setStats(prev => ({
            ...prev,
            [name]: value ? Number(value) : value
        }));
        // Очищаем ошибку валидации при изменении поля
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setSaveError(null);
            await Promise.all([
                userAPI.updateProfile(profile),
                userAPI.updateStats(stats)
            ]);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to save profile:', err);
            setSaveError('Не удалось сохранить изменения. Пожалуйста, попробуйте снова.');
        }
    };

    const navigate = useNavigate();

    const handleExerciseClick = (id) => {
        navigate(`/exercise/${id}`);
    };

    const dataTrainings = [
        {
            id: 1,
            title: 'Силовая тренировка',
            description: 'Комплекс упражнений для развития силы',
            duration: '60 мин',
            level: 'Средний',
            type: 'Силовая',
            image: 'train.jpg'
        },
        {
            id: 2,
            title: 'Кардио для начинающих',
            description: 'Базовые упражнения для улучшения выносливости',
            duration: '30 мин',
            level: 'Начинающий',
            type: 'Кардио',
            image: 'train.jpg'
        },
        {
            id: 3,
            title: 'Йога',
            description: 'Комплекс для пробуждения и растяжки',
            duration: '60 мин',
            level: 'Любой',
            type: 'Йога',
            image: 'train.jpg'
        },
        {
            id: 4,
            title: 'Интервальный тренинг',
            description: 'HIIT программа для сжигания жира',
            duration: '40 мин',
            level: 'Продвинутый',
            type: 'HIIT',
            image: 'train.jpg'
        },
        {
            id: 5,
            title: 'Тренировка спины',
            description: 'Укрепление мышц спины и корпуса',
            duration: '50 мин',
            level: 'Средний',
            type: 'Силовая',
            image: 'train.jpg'
        },
        {
            id: 6,
            title: 'Функциональный тренинг',
            description: 'Упражнения для повседневной активности',
            duration: '45 мин',
            level: 'Начинающий',
            type: 'Функциональная',
            image: 'train.jpg'
        }
    ];

    const addedExercises = dataTrainings.filter(training =>
        [2, 1, 3, 5].includes(training.id)
    );

    const recomendedExercises = dataTrainings.filter(training =>
        [4, 3, 1].includes(training.id)
    );

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Загрузка данных профиля...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                    Попробовать снова
                </button>
            </div>
        );
    }

    if (!profile || !stats) {
        return (
            <div className="error-container">
                <p className="error-message">Данные профиля не найдены</p>
            </div>
        );
    }

    return (
        <div className="profile-container">
            {saveError && (
                <div className="error-message save-error">
                    {saveError}
                </div>
            )}
            <section className="profile-section">
                <div className="profile-header">
                    <h2>Данные о профиле</h2>
                    <button
                        className={`edit-btn ${isEditing ? "save-btn" : ""}`}
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    >
                        {isEditing ? "Сохранить" : "Изменить данные"}
                    </button>
                </div>
                <div className="profile-grid">
                    <div className="gray-box"></div>
                    <div className="text">
                        {isEditing ? (
                            <div className="edit-form">
                                <div className="form-group">
                                    <label>Имя:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleProfileChange}
                                        className={validationErrors.name ? 'error' : ''}
                                    />
                                    {validationErrors.name && (
                                        <span className="validation-error">{validationErrors.name}</span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>Рост (см):</label>
                                    <input
                                        type="number"
                                        name="height"
                                        value={stats.height}
                                        onChange={handleStatsChange}
                                        className={validationErrors.height ? 'error' : ''}
                                    />
                                    {validationErrors.height && (
                                        <span className="validation-error">{validationErrors.height}</span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>Вес (кг):</label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={stats.weight}
                                        onChange={handleStatsChange}
                                        className={validationErrors.weight ? 'error' : ''}
                                    />
                                    {validationErrors.weight && (
                                        <span className="validation-error">{validationErrors.weight}</span>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>Цель:</label>
                                    <select
                                        name="goal"
                                        value={stats.goal}
                                        onChange={handleStatsChange}
                                    >
                                        <option value="Похудение">Похудение</option>
                                        <option value="Набор массы">Набор массы</option>
                                        <option value="Поддержание формы">Поддержание формы</option>
                                        <option value="Увеличение силы">Увеличение силы</option>
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p>Имя: {profile.name}</p>
                                <p>Рост: {stats.height} см</p>
                                <p>Вес: {stats.weight} кг</p>
                                <p>Цель: {stats.goal}</p>
                                <p>Тренировок: {stats.workouts}</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="tab-switcher">
                <button
                    className={`tab-btn ${activeTab === "exercises" ? "active" : ""}`}
                    onClick={() => setActiveTab("exercises")}
                >
                    Мои упражнения
                </button>
                <button
                    className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
                    onClick={() => setActiveTab("stats")}
                >
                    Статистика
                </button>
            </div>

            {activeTab === "exercises" && (
                <>
                    <section className="added-exercises">
                        <h2>Добавленные упражнения</h2>
                        <div className="exercises-grid">
                            {addedExercises.map((training) => (
                                <div className="exercise-card" key={training.id}>
                                    <h3>{training.title}</h3>
                                    <p>{training.description}</p>
                                    <button
                                        className="details-btn"
                                        onClick={() => handleExerciseClick(training.id)}
                                    >
                                        Подробнее
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="recommended-exercises">
                        <h2>Рекомендованные упражнения</h2>
                        <div className="recommended-list">
                            {recomendedExercises.slice(0, 2).map((training) => (
                                <div className="recommended-item" key={`rec-${training.id}`}>
                                    <p>{training.title}</p>
                                    <button
                                        className="details-btn"
                                        onClick={() => handleExerciseClick(training.id)}
                                    >
                                        Подробнее
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}

            {activeTab === "stats" && (
                <section className="stats-section">
                    <h2>Статистика тренировок</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>Общее количество</h3>
                            <p className="stat-value">{stats.workouts}</p>
                            <p>тренировок</p>
                        </div>
                        <div className="stat-card">
                            <h3>Средняя продолжительность</h3>
                            <p className="stat-value">{stats.averageDuration} минут</p>
                        </div>
                        <div className="stat-card">
                            <h3>Посещаемость</h3>
                            <p className="stat-value">{stats.attendancePercentage}%</p>
                            <p>по плану</p>
                        </div>
                        <div className="stat-card large">
                            <h3>Прогресс за месяц</h3>
                            <div className="gray-box" style={{ height: `${stats.progressPercentage}%` }}></div>
                            <p>+{stats.progressPercentage}% к показателям</p>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
