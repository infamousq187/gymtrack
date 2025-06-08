import "../assets/css/MainPage.css";
import { useNavigate } from "react-router-dom";

export default function MainPage() {

    const navigate = useNavigate();
    const handleStartClick = () => {
        navigate("/register");
    };

  return (
    <>
      <main className="main-container">
        
        <section className="hero-section">
          <div className="hero-content">
            <h1>Спорт - это просто!</h1>
                      <button className="cta-button" onClick={handleStartClick}>НАЧАТЬ СЕЙЧАС</button>
          </div>
        </section>

        <section className="articles-section">
          <div className="article-card">
            <h2>Заголовок статьи</h2>
            <p>Статья-информация</p>
            <div className="placeholder-line"></div>
            <div className="placeholder-line"></div>
          </div>
          
          <div className="article-card">
            <h2>Заголовок статьи</h2>
            <p>Статья-информация</p>
            <div className="placeholder-line"></div>
            <div className="placeholder-line"></div>
          </div>
          
          <div className="article-card">
            <h2>Заголовок статьи</h2>
            <p>Статья-информация</p>
            <div className="placeholder-line"></div>
            <div className="placeholder-line"></div>
          </div>
        </section>

        <section className="training-section">
          <div className="training-card">
            <h2>Подобрать план тренировок</h2>
            <div className="placeholder-line"></div>
            <div className="placeholder-line"></div>
            <button className="training-button">подобрать</button>
          </div>
        </section>

      </main>
    </>
  );
}
