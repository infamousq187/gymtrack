import logo from '../img/logo.svg';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logo} alt="Logo" className="footer-logo-img" />
        </div>
        <div className="footer-section">
          <h3>Контакты</h3>
          <p>Почта: example@example.edu</p>
          <p>Телефон: +7-900-553-53-51</p>
          <p>Соц.сети:</p>
        </div>
        <div className="footer-section">
          <h3>Навигация</h3>
          <div className="footer-links">
            <div>
              <a href="/">Главная</a>
              <a href="/about">О сервисе</a>
            </div>
            <div>
              <a href="/trainings">Тренировки</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
