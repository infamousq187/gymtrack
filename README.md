# GymTrack — Веб-сервис для управления тренировками

## Описание

**GymTrack** — это REST API для управления тренировками в тренажёрном зале.  
Проект реализован на Java с использованием Spring Boot, Spring Security, JWT, JPA и H2/PostgreSQL.

## Основной функционал

- **Регистрация и вход**
  - Регистрация новых пользователей (спортсменов и тренеров)
  - Вход с использованием JWT-токенов
  - Роли: пользователь (спортсмен), тренер, админ

- **Личный кабинет**
  - Просмотр имени и роли пользователя
  - Просмотр списка своих тренировок

- **Упражнения**
  - Просмотр общего списка упражнений (все пользователи)
  - Добавление, редактирование и удаление упражнений (только тренер/админ)

- **Тренировки**
  - Создание тренировки с указанием даты, упражнений, подходов, повторений и веса
  - Просмотр списка своих тренировок

- **Статистика**
  - Получение данных для построения графика прогресса по выбранному упражнению (дата — вес)

- **Swagger UI**
  - Документация и тестирование API:  
    [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

## Быстрый старт

1. Клонируй репозиторий:
   ```
   git clone https://github.com/ТВОЙ_ЛОГИН/gymtrack.git
   ```
2. Открой проект в IntelliJ IDEA или другой IDE.
3. Запусти приложение (`GymtrackApplication`).
4. Открой Swagger UI для тестирования API.

## Технологии

- Java 17+
- Spring Boot
- Spring Security (JWT)
- Spring Data JPA
- H2 Database (или PostgreSQL)
- Lombok
- Swagger (Springdoc OpenAPI)

## Примеры запросов

- **Регистрация пользователя:**
  ```
  POST /api/auth/register
  {
    "username": "vasya",
    "password": "12345",
    "name": "Вася",
    "role": "USER"
  }
  ```

- **Вход:**
  ```
  POST /api/auth/login
  {
    "username": "vasya",
    "password": "12345"
  }
  ```

- **Создание тренировки:**
  ```
  POST /api/trainings
  {
    "date": "2024-05-10",
    "exercises": [
      {
        "exercise": { "id": 1 },
        "sets": 3,
        "reps": 10,
        "weight": 60.0
      }
    ]
  }
  ```
