from pathlib import Path
import pandas as pd

from recommender import EventRecommender


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_FILE = BASE_DIR / "event_recommender.pkl"


# ============================================================
# LOAD MODEL ONCE
# ============================================================

model = EventRecommender.load(
    MODEL_FILE
)


# ============================================================
# RECOMMEND EVENTS
# ============================================================

def get_recommendations(
    user_id,
    events_df,
    top_n=20
):

    recommendations = model.recommend(
        user_id=user_id,
        events=events_df,
        top_n=top_n
    )

    return recommendations[
        [
            "event_id",
            "event_name",
            "event_type",
            "mode",
            "recommendation_score"
        ]
    ]