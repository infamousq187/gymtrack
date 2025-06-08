import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.svg";
import "../assets/css/About.css";

export default function AboutPage() {
    const navigate = useNavigate();

    return (
        <div className="about-container">
            
            <div className="about-content">
                <h1>О нашем сервисе</h1>
                <div className="logo-container">
                <img src={logo} alt="Логотип" className="about-logo" />
            </div>
                <div className="about-section">
                    <h2>Наша миссия</h2>
                    <p>
                        Мы создали этот сервис, чтобы помочь людям достигать своих спортивных целей
                        с помощью персональных тренировочных программ и профессионального сопровождения.
                    </p>
                </div>

                <div className="about-section">
                    <h2>Преимущества</h2>
                    <ul className="features-list">
                        <li>Персональные тренировочные планы</li>
                        <li>Доступ к профессиональным тренерам</li>
                        <li>Трекинг прогресса и статистика</li>
                        <li>Сообщество единомышленников</li>
                        <li>Кроссплатформенная доступность</li>
                    </ul>
                </div>

                <div className="about-section">
                    <h2>Как это работает</h2>
                    <div className="steps-container">
                        <div className="step">
                            <div className="step-number">1</div>
                            <p>Регистрация в сервисе</p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <p>Составление персональной программы</p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <p>Тренировки и отслеживание прогресса</p>
                        </div>
                    </div>
                </div>

                <div className="about-section team-section">
                    <h2>Наша команда</h2>
                    <div className="team-members">
                        <div className="member">
                            <div className="member-avatar"></div>
                            <h3>Иван Иванов</h3>
                            <p>Главный тренер</p>
                        </div>
                        <div className="member">
                            <div className="member-avatar"></div>
                            <h3>Петр Петров</h3>
                            <p>Разработчик</p>
                        </div>
                        <div className="member">
                            <div className="member-avatar"></div>
                            <h3>Сергей Сергеев</h3>
                            <p>Аналитик</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
