import pandas as pd

from recommend_api import get_recommendations


# Load events
events = pd.read_csv(
    "events_test.csv"
)


# Select user
user_id = "U001"


# Get recommendations
recommendations = get_recommendations(
    user_id=user_id,
    events_df=events,
    top_n=20
)


# Display
print("\nTOP 20 RECOMMENDATIONS")
print("=" * 60)

print(
    recommendations.to_string(
        index=False
    )
)