from flask import Flask, render_template, request, jsonify, session
import pandas as pd
import pickle
import os

# Путь к модели
MODEL_PATH = os.path.join(os.path.dirname(__file__), "catboost_correct.pkl")

# Список признаков
features = [
    "user_id",
    "nm_id",
    "CreatedDate",
    "service",
    "total_ordered",
    "PaymentType",
    "IsPaid",
    "count_items",
    "unique_items",
    "avg_unique_purchase",
    "is_courier",
    "NmAge",
    "Distance",
    "DaysAfterRegistration",
    "number_of_orders",
    "number_of_ordered_items",
    "mean_number_of_ordered_items",
    "min_number_of_ordered_items",
    "max_number_of_ordered_items",
    "mean_percent_of_ordered_items"
]

# Загрузка модели
try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
except Exception as e:
    print(f"Ошибка при загрузке модели: {e}")
    model = None

# Flask-приложение
app = Flask(__name__)
app.secret_key = os.urandom(24)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/predict_file", methods=["POST"])
def predict_file():
    try:
        if "file" not in request.files:
            return jsonify({"error": "Файл не передан"}), 400

        file = request.files["file"]
        filename = file.filename.lower()

        if filename.endswith(".csv"):
            df = pd.read_csv(file)
        elif filename.endswith(".json"):
            df = pd.read_json(file)
        else:
            return jsonify({"error": "Поддерживаются только CSV и JSON"}), 400

        missing = [col for col in features if col not in df.columns]
        if missing:
            return jsonify({
                "error": "Отсутствуют колонки",
                "missing_columns": missing
            }), 400

        df['CreatedDate'] = pd.to_datetime(df['CreatedDate'])
        df['order_hour'] = df['CreatedDate'].dt.hour
        df.drop(columns=['CreatedDate', 'nm_id', 'user_id'], inplace=True)

        prediction = model.predict(df)
        probability = model.predict_proba(df)[:, 1]

        session['predictions'] = prediction.tolist()
        session['probabilities'] = probability.tolist()

        return jsonify({
            "prediction": prediction.tolist(),
            "probability": probability.tolist()
        })

    except Exception as e:
        return jsonify({"error": f"Ошибка обработки файла: {str(e)}"}), 500


@app.route("/predict_form", methods=["POST"])
def predict_form():
    try:
        # Получаем данные из формы
        form_data = {field: request.form.get(field) for field in features}

        # Приведение к нужным типам
        df = pd.DataFrame([form_data])

        # Конвертации
        df["CreatedDate"] = pd.to_datetime(df["CreatedDate"])
        df["order_hour"] = df["CreatedDate"].dt.hour
        df.drop(columns=["CreatedDate", "nm_id", "user_id"], inplace=True)

        # Преобразования типов
        num_cols = [
            "total_ordered", "count_items", "unique_items", "avg_unique_purchase",
            "is_courier", "NmAge", "Distance", "DaysAfterRegistration",
            "number_of_orders", "number_of_ordered_items",
            "mean_number_of_ordered_items", "min_number_of_ordered_items",
            "max_number_of_ordered_items", "mean_percent_of_ordered_items"
        ]
        for col in num_cols:
            df[col] = pd.to_numeric(df[col], errors='coerce')

        df["IsPaid"] = df["IsPaid"].map({"True": True, "False": False})

        # Предсказание
        prediction = model.predict(df)
        probability = model.predict_proba(df)[:, 1]

        return jsonify({
            "prediction": prediction.tolist(),
            "probability": probability.tolist()
        })

    except Exception as e:
        return jsonify({"error": f"Ошибка обработки формы: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
