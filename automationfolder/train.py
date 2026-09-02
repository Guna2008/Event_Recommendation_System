import pandas as pd

from recommender import EventRecommender


# ============================================
# Configuration
# ============================================

USER_FILE = "college_students_synthetic_dataset.csv"

MODEL_FILE = "event_recommender.pkl"


# ============================================
# Load user data
# ============================================

print("Loading user dataset...")

users = pd.read_csv(USER_FILE)

print(f"Loaded {len(users)} users.")


# ============================================
# Create recommender
# ============================================

recommender = EventRecommender()


# ============================================
# Prepare / encode users
# ============================================

print("\nEncoding user features...")

recommender.prepare_users(users)


# ============================================
# Find optimal K using Elbow Method
# ============================================

print("\nFinding optimal number of clusters...")

optimal_k = recommender.elbow_method(
    min_k=2,
    max_k=10,
    show_plot=True
)

print(
    f"\nOptimal K selected: {optimal_k}"
)


# ============================================
# Train K-Means
# ============================================

print("\nTraining K-Means...")

recommender.train(
    k=optimal_k
)


# ============================================
# Display clusters
# ============================================

print("\nSample cluster assignments:")

print(
    recommender.users[
        ["user_id", "cluster"]
    ].head(20)
)


# ============================================
# Save model
# ============================================

recommender.save(
    MODEL_FILE
)

print(
    "\nTraining completed!"
)

print(
    f"Model saved as: {MODEL_FILE}"
)