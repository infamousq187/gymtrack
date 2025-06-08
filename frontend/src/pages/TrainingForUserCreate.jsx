import { useState, useEffect } from "react";
import { userAPI } from "../api/user";
import { exerciseAPI } from "../api/exercise";
import { trainingAPI } from "../api/training";
import "../assets/css/TrainingCreate.css";

export default function TrainingForUserCreate() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    exerciseAPI.getAll().then(setAllExercises);
    userAPI.getAll().then(users => {
      setUsers(users);
      setFilteredUsers(users);
    });
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(u =>
          (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
          (u.username || "").toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, users]);

  const handleAddExercise = () => {
    setSelected([...selected, { exerciseId: '', sets: 1, reps: 1, weight: 0 }]);
  };

  const handleChange = (idx, field, value) => {
    setSelected(selected.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Начало создания тренировки');
    if (!selectedUser) {
      console.log('Пользователь не выбран');
      return alert('Выберите пользователя!');
    }
    if (!date) {
      console.log('Дата не выбрана');
      return alert('Выберите дату!');
    }
    if (selected.length === 0) {
      console.log('Нет упражнений');
      return alert('Добавьте хотя бы одно упражнение!');
    }
    try {
      console.log('Отправка запроса на создание тренировки', {
        userId: selectedUser.id,
        date,
        exercises: selected
      });
      setIsSubmitting(true);
      setError(null);
      const response = await trainingAPI.addForUser({
        date,
        exercises: selected.map(ex => ({
          exercise: { id: ex.exerciseId },
          sets: Number(ex.sets),
          reps: Number(ex.reps),
          weight: Number(ex.weight)
        }))
      }, selectedUser.id);
      console.log('Ответ сервера:', response);
      setDate('');
      setSelected([]);
      setSelectedUser(null);
      setSearch('');
      setSuccessMessage('Тренировка успешно добавлена!');
    } catch (err) {
      console.error('Ошибка при создании тренировки:', err);
      setError('Не удалось создать тренировку. Пожалуйста, попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="training-create-container">
      <h2>Создать тренировку для пользователя</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div style={{ flex: 1, minWidth: 250 }}>
          <label htmlFor="user-search" style={{ fontWeight: 500 }}>Поиск пользователя:</label>
          <input
            id="user-search"
            type="text"
            placeholder="Введите имя или логин"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-group"
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #eee', borderRadius: 8, background: '#fafbfc' }}>
            {filteredUsers.length === 0 ? (
              <div style={{ padding: '1rem', color: '#888' }}>Пользователи не найдены</div>
            ) : (
              filteredUsers.map(u => (
                <div
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  style={{
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    background: selectedUser?.id === u.id ? '#e6f7ff' : 'transparent',
                    borderBottom: '1px solid #f0f0f0',
                    fontWeight: selectedUser?.id === u.id ? 600 : 400
                  }}
                >
                  {u.name} <span style={{ color: '#888' }}>({u.username})</span>
                </div>
              ))
            )}
          </div>
        </div>
        <div style={{ flex: 2 }}>
          {selectedUser && (
            <div style={{ marginBottom: '1.5rem', fontWeight: 500, fontSize: '1.1rem' }}>
              Пользователь: {selectedUser.name} <span style={{ color: '#888' }}>({selectedUser.username})</span>
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
                required
              />
            </div>
            <div className="exercises-section">
              <h3>Упражнения</h3>
              {selected.map((ex, idx) => (
                <div key={idx} className="exercise-item">
                  <div className="exercise-row">
                    <div className="form-group">
                      <select
                        value={ex.exerciseId}
                        onChange={e => handleChange(idx, 'exerciseId', e.target.value)}
                        required
                      >
                        <option value="">Выберите упражнение</option>
                        {allExercises.map(opt => (
                          <option key={opt.id} value={opt.id}>{opt.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <input
                        type="number"
                        min="1"
                        placeholder="Подходы"
                        value={ex.sets}
                        onChange={e => handleChange(idx, 'sets', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="number"
                        min="1"
                        placeholder="Повторы"
                        value={ex.reps}
                        onChange={e => handleChange(idx, 'reps', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="Вес (кг)"
                        value={ex.weight}
                        onChange={e => handleChange(idx, 'weight', e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelected(selected.filter((_, i) => i !== idx))}
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
                style={{ marginTop: 8 }}
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
      </div>
    </div>
  );
} 