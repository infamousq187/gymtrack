import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exerciseAPI } from "../api/exercise";
import { authAPI } from "../api/auth";
import "../assets/css/ExercisesAdmin.css";

export default function ExercisesAdmin() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Проверяем, является ли пользователь тренером
    if (!authAPI.isCoach()) {
      navigate('/profile');
      return;
    }

    loadExercises();
  }, [navigate]);

  useEffect(() => {
    // Очищаем сообщение об успехе через 5 секунд
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await exerciseAPI.getAll();
      setExercises(data);
    } catch (err) {
      console.error('Failed to fetch exercises:', err);
      setError('Не удалось загрузить список упражнений');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) {
      errors.name = 'Название упражнения обязательно';
    } else if (form.name.length < 3) {
      errors.name = 'Название должно содержать минимум 3 символа';
    }
    if (form.description && form.description.length > 500) {
      errors.description = 'Описание не должно превышать 500 символов';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Очищаем ошибку валидации при изменении поля
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitError(null);
      if (editId) {
        await exerciseAPI.update(editId, form);
        setSuccessMessage('Упражнение успешно обновлено');
      } else {
        await exerciseAPI.add(form);
        setSuccessMessage('Упражнение успешно добавлено');
      }
      setForm({ name: "", description: "" });
      setEditId(null);
      loadExercises();
    } catch (err) {
      console.error('Failed to save exercise:', err);
      setSubmitError(editId ? 
        'Не удалось обновить упражнение' : 
        'Не удалось добавить упражнение'
      );
    }
  };

  const handleEdit = ex => {
    setForm({ name: ex.name, description: ex.description || "" });
    setEditId(ex.id);
    setValidationErrors({});
  };

  const handleDelete = async id => {
    if (!window.confirm("Вы уверены, что хотите удалить это упражнение?")) {
      return;
    }

    try {
      setSubmitError(null);
      await exerciseAPI.delete(id);
      setSuccessMessage('Упражнение успешно удалено');
      loadExercises();
    } catch (err) {
      console.error('Failed to delete exercise:', err);
      setSubmitError('Не удалось удалить упражнение');
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ name: "", description: "" });
    setValidationErrors({});
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка списка упражнений...</p>
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
    <div className="exercises-admin-container">
      <h2>Управление упражнениями</h2>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {submitError && (
        <div className="error-message submit-error">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="exercise-form">
        <div className="form-group">
          <input
            name="name"
            placeholder="Название упражнения"
            value={form.name}
            onChange={handleChange}
            className={validationErrors.name ? 'error' : ''}
            required
          />
          {validationErrors.name && (
            <span className="validation-error">{validationErrors.name}</span>
          )}
        </div>

        <div className="form-group">
          <textarea
            name="description"
            placeholder="Описание упражнения"
            value={form.description}
            onChange={handleChange}
            className={validationErrors.description ? 'error' : ''}
            rows="3"
          />
          {validationErrors.description && (
            <span className="validation-error">{validationErrors.description}</span>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editId ? "Сохранить изменения" : "Добавить упражнение"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn"
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      <div className="exercises-list">
        {exercises.length === 0 ? (
          <div className="empty-state">
            <p>Нет доступных упражнений</p>
          </div>
        ) : (
          exercises.map(ex => (
            <div key={ex.id} className="exercise-card">
              <div className="exercise-content">
                <h3>{ex.name}</h3>
                {ex.description && <p>{ex.description}</p>}
              </div>
              <div className="exercise-actions">
                <button
                  onClick={() => handleEdit(ex)}
                  className="edit-btn"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(ex.id)}
                  className="delete-btn"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 