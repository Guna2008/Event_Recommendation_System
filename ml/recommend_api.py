from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

from recommender import EventRecommender


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
MODEL_FILE = BASE_DIR / "event_recommender.pkl"


# ============================================================
# LOAD MODEL ONCE
# ============================================================

model = EventRecommender.load(MODEL_FILE)


# ============================================================
# HELPERS
# ============================================================

def to_list(value):
    """
    Convert a value into a clean list.

    Supports:
        ["Python", "Machine Learning"]
        "Python, Machine Learning"
        None
    """

    if value is None:
        return []

    if isinstance(value, list):
        return [str(x).strip() for x in value if str(x).strip()]

    if isinstance(value, str):
        return [
            x.strip()
            for x in value.split(",")
            if x.strip()
        ]

    return []


def safe_float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


# ============================================================
# REAL USER PROFILE RECOMMENDATIONS
# ============================================================

def get_recommendations_from_profile(
    user_profile,
    events_df,
    top_n=20
):
    """
    Generate recommendations for a real application user.

    The real user's profile is encoded using the encoders
    stored inside the trained EventRecommender model.

    This does NOT require the real PostgreSQL user ID to exist
    in the synthetic training dataset.
    """

    # --------------------------------------------------------
    # Prepare user profile
    # --------------------------------------------------------

    skills = to_list(
        user_profile.get("skills")
    )

    interests = to_list(
        user_profile.get("interests")
    )

    event_types = to_list(
        user_profile.get("preferred_event_type")
        or user_profile.get("preferredEventType")
        or user_profile.get("event_type")
    )

    mode = user_profile.get(
        "preferred_mode"
        or user_profile.get("preferredMode")
        or user_profile.get("mode")
    )

    if mode is None:
        mode = ""

    mode = str(mode).strip()

    # --------------------------------------------------------
    # Create user dataframe in exactly the format expected
    # by the trained model.
    # --------------------------------------------------------

    user_data = {
        "user_id": "REAL_USER",
        "skills": ", ".join(skills),
        "interests": ", ".join(interests),
        "preferred_event_type": ", ".join(event_types),
        "preferred_mode": mode,
    }

    user_df = pd.DataFrame([user_data])

    # --------------------------------------------------------
    # Encode real user using trained model encoders
    # --------------------------------------------------------

    user_vector = model.encode_single_user(user_df)

    user_vector = np.asarray(
        user_vector,
        dtype=float
    )

    if user_vector.ndim == 1:
        user_vector = user_vector.reshape(1, -1)

    # --------------------------------------------------------
    # Prepare events
    # --------------------------------------------------------

    events = events_df.copy()

    required_columns = [
        "event_id",
        "event_name",
        "skills",
        "interests",
        "event_type",
        "mode",
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in events.columns
    ]

    if missing_columns:
        raise ValueError(
            "Missing event columns: "
            + ", ".join(missing_columns)
        )

    # --------------------------------------------------------
    # Encode events using trained model encoders
    # --------------------------------------------------------

    event_vectors = model.encode_events(events)

    event_vectors = np.asarray(
        event_vectors,
        dtype=float
    )

    if event_vectors.ndim == 1:
        event_vectors = event_vectors.reshape(1, -1)

    # --------------------------------------------------------
    # Calculate similarity
    # --------------------------------------------------------

    similarities = cosine_similarity(
        user_vector,
        event_vectors
    )[0]

    events["recommendation_score"] = similarities

    # --------------------------------------------------------
    # Sort highest score first
    # --------------------------------------------------------

    events = events.sort_values(
        "recommendation_score",
        ascending=False
    )

    # --------------------------------------------------------
    # Return top N
    # --------------------------------------------------------

    return events.head(top_n).reset_index(drop=True)