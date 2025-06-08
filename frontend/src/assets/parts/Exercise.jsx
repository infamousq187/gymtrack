import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../css/Exercise.css';

// Данные тренировок
const dataTrainings = [
    {
        id: 1,
        title: 'Силовая тренировка',
        description: 'Комплекс упражнений для развития силы',
        duration: '60 мин',
        level: 'Средний',
        type: 'Силовая',
        image: 'train.jpg',
        exercises: [
            {
                id: 101,
                name: 'Приседания со штангой',
                instructions: [
                    'Встаньте прямо со штангой на плечах',
                    'Опуститесь в присед до параллели',
                    'Вернитесь в исходное положение'
                ]
            },
            {
                id: 102,
                name: 'Жим лёжа',
                instructions: [
                    'Лягте на скамью',
                    'Опустите штангу к груди',
                    'Выжмите вверх'
                ]
            }
        ]
    },
    {
        id: 2,
        title: 'Кардио для начинающих',
        description: 'Базовые упражнения для улучшения выносливости',
        duration: '30 мин',
        level: 'Начинающий',
        type: 'Кардио',
        image: 'train.jpg',
        exercises: [
            {
                id: 201,
                name: 'Прыжки через скакалку',
                instructions: [
                    'Займите положение для прыжков',
                    'Сделайте 20 прыжков черз скакалку',
                    'Вернитесь в исходное положение'
                ]
            }
        ]
    },
];

export default function ExercisePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [training, setTraining] = useState(null);

    useEffect(() => {
        const found = dataTrainings.find(t => t.id === parseInt(id));
        setTraining(found);
    }, [id]);

    if (!training) return (
        <div className="not-found-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Назад
            </button>
            <div className="not-found">
                <h2>Тренировка не найдена</h2>
                <button
                    className="primary-button"
                    onClick={() => navigate('/trainings')}
                >
                    Вернуться к списку тренировок
                </button>
            </div>
        </div>
    )

    return (
        <div className="exercise-page">
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Назад
            </button>

            <div className="exercise-header">
                <h1>{training.title}</h1>
                <div className="exercise-meta">
                    <span className="category">{training.type}</span>
                    <span className="difficulty">{training.level}</span>
                    <span className="duration">{training.duration}</span>
                </div>
            </div>

            <div className="exercise-content">
                <div className="exercise-image">
                    <img src={training.image} alt={training.title} />
                </div>

                <section className="exercise-section">
                    <h2>Описание</h2>
                    <p>{training.description}</p>
                </section>

                {training.exercises && training.exercises.length > 0 && (
                    <section className="exercise-section">
                        <h2>Упражнения</h2>
                        {training.exercises.map((ex) => (
                            <div key={ex.id} className="exercise-item">
                                <h3>{ex.name}</h3>
                                <ol className="instructions-list">
                                    {ex.instructions.map((step, index) => (
                                        <li key={index}>{step}</li>
                                    ))}
                                </ol>
                            </div>
                        ))}
                    </section>
                )}
            </div>

            <div className="exercise-actions">
                <button className="save-button">Сохранить</button>
            </div>
        </div>
    );
}
