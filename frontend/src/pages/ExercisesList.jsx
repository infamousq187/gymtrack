import { useEffect, useState } from "react";
import { exerciseAPI } from "../api/exercise";
import "../assets/css/ExercisesAdmin.css";

export default function ExercisesList() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await exerciseAPI.getAll();
        setExercises(data);
      } catch (err) {
        setError("Не удалось загрузить упражнения");
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div>Загрузка...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="exercises-admin-container">
      <h2>Список упражнений</h2>
      <div className="exercises-list">
        {exercises.length === 0 ? (
          <div className="empty-state">Нет доступных упражнений</div>
        ) : (
          exercises.map(ex => (
            <div key={ex.id} className="exercise-card">
              <div className="exercise-content">
                <h3>{ex.name}</h3>
                {ex.description && <p>{ex.description}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 