"""
Standalone demo microservice for the KMeans-based EventRecommender.

IMPORTANT: this model was trained on `college_students_synthetic_dataset.csv`
(synthetic student user_ids like "U001") and expects an events table shaped
like `events_test.csv` (event_id, event_name, skills, interests, event_type,
mode). It has no knowledge of the real users/events created through the
Node/Postgres backend, so it is NOT wired into the main app's
/recommendations endpoint — that endpoint uses a live, DB-driven
content-based scorer instead (see backend/src/services/recommendationService.js).

This file just makes the existing trained model runnable over HTTP so you
can demo/inspect it on its own:

    pip install -r requirements.txt flask
    python app.py
    curl http://localhost:8000/recommend/U001
"""

from pathlib import Path

import pandas as pd
from flask import Flask, jsonify

from recommend_api import get_recommendations

BASE_DIR = Path(__file__).resolve().parent
EVENTS_FILE = BASE_DIR / "events_test.csv"

app = Flask(__name__)


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/recommend/<user_id>")
def recommend(user_id):
    try:
        events = pd.read_csv(EVENTS_FILE)
        recommendations = get_recommendations(user_id=user_id, events_df=events, top_n=20)
        return jsonify(recommendations.to_dict(orient="records"))
    except ValueError as error:
        return jsonify({"error": str(error)}), 404
    except Exception as error:  # pragma: no cover - demo service
        return jsonify({"error": str(error)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
