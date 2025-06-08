import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { trainingAPI } from "../api/training";
import "../assets/css/TrainingsList.css";

console.log("TrainingsList mounted (import)");

export default function TrainingsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || null);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await trainingAPI.getMy();
        setTrainings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch trainings:', err);
        setError('Не удалось загрузить список тренировок');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  useEffect(() => {
    // Очищаем сообщение об успехе через 5 секунд
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту тренировку?')) {
      return;
    }

    try {
      setDeleteError(null);
      await trainingAPI.delete(id);
      setTrainings(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete training:', err);
      setDeleteError('Не удалось удалить тренировку');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка списка тренировок...</p>
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

  return (
    <div className="trainings-list-container">
      <div className="trainings-header">
        <h2>Мои тренировки</h2>
        <button
          onClick={() => navigate('/trainings/create')}
          className="create-btn"
        >
          Создать тренировку
        </button>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {deleteError && (
        <div className="error-message delete-error">
          {deleteError}
        </div>
      )}

      {trainings.length === 0 ? (
        <div className="empty-state">
          <p>У вас пока нет тренировок</p>
          <button
            onClick={() => navigate('/trainings/create')}
            className="create-btn"
          >
            Создать первую тренировку
          </button>
        </div>
      ) : (
        <div className="trainings-grid">
          {trainings.map(tr => (
            <div key={tr.id} className="training-card">
              <div className="training-header">
                <h3>{formatDate(tr.date)}</h3>
                <button
                  onClick={() => handleDelete(tr.id)}
                  className="delete-btn"
                  title="Удалить тренировку"
                >
                  ×
                </button>
              </div>
              <div className="exercises-list">
                {tr.exercises && tr.exercises.length > 0 ? (
                  tr.exercises.map((ex, idx) => (
                    <div key={ex.id || idx} className="exercise-item">
                      <span className="exercise-name">{ex.exerciseName}</span>
                      <span className="exercise-details">
                        {ex.sets} × {ex.reps} • {ex.weight} кг
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="exercise-item">Нет упражнений</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 