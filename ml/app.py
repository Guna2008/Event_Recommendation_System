from flask import Flask, jsonify, request
import pandas as pd

from recommend_api import get_recommendations_from_profile


app = Flask(__name__)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():
    return jsonify({
        "status": "ok"
    })


# ============================================================
# RECOMMENDATIONS
# ============================================================

@app.post("/recommend")
def recommend():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "error": "Request body is required"
            }), 400

        user = data.get("user")
        events = data.get("events")

        if not user:
            return jsonify({
                "success": False,
                "error": "user is required"
            }), 400

        if not events:
            return jsonify({
                "success": False,
                "error": "events are required"
            }), 400

        # Convert events received from Express
        # into pandas dataframe.
        events_df = pd.DataFrame(events)

        top_n = data.get("top_n", 20)

        recommendations = get_recommendations_from_profile(
            user_profile=user,
            events_df=events_df,
            top_n=top_n
        )

        return jsonify({
            "success": True,
            "data": recommendations.to_dict(
                orient="records"
            )
        })

    except ValueError as error:

        return jsonify({
            "success": False,
            "error": str(error)
        }), 400

    except Exception as error:

        print("ML ERROR:", error)

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500


# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    )