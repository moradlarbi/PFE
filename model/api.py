import os
import joblib
import pymysql
import pandas as pd
from flask import Flask, request, jsonify
from urllib.parse import urlparse


# Charger le modèle
model = joblib.load('model.pkl')

# Charger les données CSV pour imputation
csv_file_path = 'merged_data_city.csv'
df_csv = pd.read_csv(csv_file_path)
composition_features = [
    'composition_food_organic_waste_percent',
    'composition_glass_percent',
    'composition_metal_percent',
    'composition_other_percent',
    'composition_paper_cardboard_percent',
    'composition_plastic_percent'
]
mean_values = df_csv[composition_features].mean().to_dict()

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json  # Récupère les données depuis Express.js
    df = pd.DataFrame(data)

    # Remplace les valeurs manquantes des colonnes de composition
    for col in composition_features:
        df[col] = pd.to_numeric(df[col], errors='coerce')
        df[col].fillna(mean_values[col], inplace=True)

    # Effectue la prédiction
    predictions = model.predict(df)

    return jsonify({"predictions": predictions.tolist()})

if __name__ == '__main__':
    app.run(port=5001)
