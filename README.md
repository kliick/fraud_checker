# Hackathon-DigitalDepartment-Wildberris-2025

## Описание

Проект разработан в рамках хакатона от Wildberries. Приложение позволяет предсказывать вероятность блокировки заказа на основе пользовательских и транзакционных данных. Используется обученная модель CatBoostClassifier, предварительно обработанные данные, а также web-интерфейс для подачи входных данных и получения результата.

## Используемые технологии
- Python 3.9
- Flask
- CatBoost
- Scikit-learn
- Pandas
- Docker
- Matplotlib
- Seaborn

## Обучение модели

- Модель: CatBoostClassifier
- Метрика оптимизации: F1-score
- Подбор гиперпараметров: GridSearchCV
- Поддержка категориальных признаков: да

## Быстрый старт

### 1. Клонируйте репозиторий
```bash
git clone https://github.com/diwshtayng/Hackathon-DigitalDepartment-Wildberris-2025.git
cd Hackathon-DigitalDepartment-Wildberris-2025/our-flask-app
```

### 2. Соберите и запустите контейнер
```bash
docker build -t our-flask-app .
docker run -dp 5002:5002 our-flask-app
```

### 3. Откройте в браузере
👉 [http://localhost:5002](http://localhost:5002)

## Структура проекта
```
Hackathon-DigitalDepartment-Wildberris-2025/
├── our-flask-app/
│   ├── app.py                # Основной файл с Flask-приложением и маршрутами
│   ├── catboost_correct.pkl  # Сериализованная обученная модель
│   ├── preprocessor.py       # Скрипт для предобработки входных данных перед предсказанием
│   ├── Dockerfile            # Инструкция для сборки Docker-образа приложения
│   ├── static/               # Место для CSS, JS, изображений, иконок и др.
│   ├── requirements.txt      # Список зависимостей Python (Flask, pandas, scikit-learn и др.)
│   └── templates/            # Место для HTML-шаблон формы ввода данных и отображения результата
├── hackaton_notebook.ipynb      #Jupyter-ноутбук с EDA, preprocessing и обучением моделей
└── README.md                 # Документация к проекту: описание, как запускать, использовать и т.д.
```

---

**© 2024 Проект по машинному обучению с использованием XGBoost и CatBoost.**
