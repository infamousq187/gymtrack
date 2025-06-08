import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { trainingAPI } from "../api/training";
import { exerciseAPI } from "../api/exercise";
import "../assets/css/TrainingCreate.css";

export default function TrainingCreate() {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [selected, setSelected] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        const exercises = await exerciseAPI.getAll();
        setAllExercises(exercises);
      } catch (err) {
        console.error('Failed to fetch exercises:', err);
        setError('Не удалось загрузить список упражнений');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!date) {
      errors.date = 'Выберите дату тренировки';
    }
    if (selected.length === 0) {
      errors.exercises = 'Добавьте хотя бы одно упражнение';
    }
    selected.forEach((ex, idx) => {
      if (!ex.exerciseId) {
        errors[`exercise_${idx}`] = 'Выберите упражнение';
      }
      if (ex.sets < 1) {
        errors[`sets_${idx}`] = 'Количество подходов должно быть не менее 1';
      }
      if (ex.reps < 1) {
        errors[`reps_${idx}`] = 'Количество повторений должно быть не менее 1';
      }
      if (ex.weight < 0) {
        errors[`weight_${idx}`] = 'Вес не может быть отрицательным';
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddExercise = () => {
    setSelected([...selected, { exerciseId: '', sets: 1, reps: 1, weight: 0 }]);
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.exercises;
      return newErrors;
    });
  };

  const handleChange = (idx, field, value) => {
    setSelected(selected.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex));
    // Очищаем ошибки валидации при изменении поля
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${field}_${idx}`];
      return newErrors;
    });
  };

  const handleRemoveExercise = (idx) => {
    if (window.confirm('Вы уверены, что хотите удалить это упражнение?')) {
      setSelected(selected.filter((_, i) => i !== idx));
      // Очищаем ошибки валидации для удаленного упражнения
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        Object.keys(newErrors).forEach(key => {
          if (key.startsWith('exercise_') || key.startsWith('sets_') || 
              key.startsWith('reps_') || key.startsWith('weight_')) {
            const [field, index] = key.split('_');
            if (Number(index) === idx) {
              delete newErrors[key];
            }
          }
        });
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await trainingAPI.add({
        date,
        exercises: selected.map(ex => ({
          exercise: { id: ex.exerciseId },
          sets: Number(ex.sets),
          reps: Number(ex.reps),
          weight: Number(ex.weight)
        }))
      });
      navigate('/trainings/my', { 
        state: { message: 'Тренировка успешно создана!' }
      });
    } catch (err) {
      console.error('Failed to create training:', err);
      setSubmitError('Не удалось создать тренировку. Пожалуйста, попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="training-create-container">
      <h2>Создать тренировку</h2>
      {submitError && (
        <div className="error-message submit-error">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="training-form">
        <div className="form-group">
          <label htmlFor="date">Дата тренировки:</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className={validationErrors.date ? 'error' : ''}
            required
          />
          {validationErrors.date && (
            <span className="validation-error">{validationErrors.date}</span>
          )}
        </div>

        <div className="exercises-section">
          <h3>Упражнения</h3>
          {validationErrors.exercises && (
            <span className="validation-error">{validationErrors.exercises}</span>
          )}
          {selected.map((ex, idx) => (
            <div key={idx} className="exercise-item">
              <div className="exercise-row">
                <div className="form-group">
                  <select
                    value={ex.exerciseId}
                    onChange={e => handleChange(idx, 'exerciseId', e.target.value)}
                    className={validationErrors[`exercise_${idx}`] ? 'error' : ''}
                    required
                  >
                    <option value="">Выберите упражнение</option>
                    {allExercises.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                  {validationErrors[`exercise_${idx}`] && (
                    <span className="validation-error">{validationErrors[`exercise_${idx}`]}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="number"
                    min="1"
                    placeholder="Подходы"
                    value={ex.sets}
                    onChange={e => handleChange(idx, 'sets', e.target.value)}
                    className={validationErrors[`sets_${idx}`] ? 'error' : ''}
                    required
                  />
                  {validationErrors[`sets_${idx}`] && (
                    <span className="validation-error">{validationErrors[`sets_${idx}`]}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="number"
                    min="1"
                    placeholder="Повторы"
                    value={ex.reps}
                    onChange={e => handleChange(idx, 'reps', e.target.value)}
                    className={validationErrors[`reps_${idx}`] ? 'error' : ''}
                    required
                  />
                  {validationErrors[`reps_${idx}`] && (
                    <span className="validation-error">{validationErrors[`reps_${idx}`]}</span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="Вес (кг)"
                    value={ex.weight}
                    onChange={e => handleChange(idx, 'weight', e.target.value)}
                    className={validationErrors[`weight_${idx}`] ? 'error' : ''}
                    required
                  />
                  {validationErrors[`weight_${idx}`] && (
                    <span className="validation-error">{validationErrors[`weight_${idx}`]}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveExercise(idx)}
                  className="remove-btn"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddExercise}
            className="add-exercise-btn"
          >
            + Добавить упражнение
          </button>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить тренировку'}
          </button>
        </div>
      </form>
    </div>
  );
} 