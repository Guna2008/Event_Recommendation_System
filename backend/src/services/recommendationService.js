const prisma = require("../../db/connection");

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL ||
  "http://localhost:8000";


// ============================================================
// GET RECOMMENDATIONS
// ============================================================

const getRecommendations = async (userId) => {

  const numericUserId = Number(userId);

  // ----------------------------------------------------------
  // VALIDATE USER ID
  // ----------------------------------------------------------

  if (!numericUserId || isNaN(numericUserId)) {
    throw new Error("Invalid user ID");
  }


  // ----------------------------------------------------------
  // GET USER + EVENTS FROM DATABASE
  // ----------------------------------------------------------

  const [user, events] = await Promise.all([

    prisma.user.findUnique({
      where: {
        id: numericUserId
      }
    }),

    prisma.event.findMany({
      where: {
        OR: [
          {
            date: null
          },
          {
            date: {
              gte: new Date()
            }
          }
        ]
      },

      orderBy: {
        date: "asc"
      }
    })

  ]);


  // ----------------------------------------------------------
  // USER NOT FOUND
  // ----------------------------------------------------------

  if (!user) {
    throw new Error("User not found");
  }


  // ----------------------------------------------------------
  // NO EVENTS
  // ----------------------------------------------------------

  if (events.length === 0) {
    return [];
  }


  // ==========================================================
  // CONVERT DATABASE EVENTS → ML EVENTS
  // ==========================================================

  const mlEvents = events.map((event) => ({

    event_id: event.id,

    event_name: event.title,

    skills: Array.isArray(event.skills)
      ? event.skills.join(", ")
      : (event.skills || ""),

    interests: Array.isArray(event.interests)
      ? event.interests.join(", ")
      : (event.interests || ""),

    event_type: event.eventType || "",

    mode: event.mode || "Online"

  }));


  // ==========================================================
  // CONVERT DATABASE USER → ML USER
  // ==========================================================

  const mlUser = {

    skills: Array.isArray(user.skills)
      ? user.skills.join(", ")
      : (user.skills || ""),

    interests: Array.isArray(user.interests)
      ? user.interests.join(", ")
      : (user.interests || ""),

    preferred_event_type:
      Array.isArray(user.preferredEventType)
        ? user.preferredEventType.join(", ")
        : (user.preferredEventType || ""),

    preferred_mode:
      user.preferredMode || "Online"

  };


  console.log(
    "\n========== SENDING TO ML =========="
  );

  console.log(
    "User:",
    mlUser
  );

  console.log(
    "Events:",
    mlEvents.length
  );

  console.log(
    "ML URL:",
    ML_SERVICE_URL
  );

  console.log(
    "===================================\n"
  );


  // ==========================================================
  // CALL PYTHON ML SERVICE
  // ==========================================================

  let response;

  try {

    response = await fetch(
      `${ML_SERVICE_URL}/recommend`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          user: mlUser,

          events: mlEvents,

          top_n: 20

        })
      }
    );

  } catch (error) {

    console.error(
      "Could not connect to ML service:",
      error
    );

    throw new Error(
      "ML recommendation service unavailable"
    );
  }


  // ==========================================================
  // READ ML RESPONSE
  // ==========================================================

  const responseText =
    await response.text();


  console.log(
    "ML STATUS:",
    response.status
  );

  console.log(
    "ML RESPONSE:",
    responseText
  );


  // ==========================================================
  // ML ERROR
  // ==========================================================

  if (!response.ok) {

    throw new Error(
      "ML recommendation service failed"
    );
  }


  // ==========================================================
  // PARSE JSON
  // ==========================================================

  let result;

  try {

    result =
      JSON.parse(responseText);

  } catch (error) {

    console.error(
      "Invalid JSON returned by ML service:",
      responseText
    );

    throw new Error(
      "Invalid response from ML service"
    );
  }


  // ==========================================================
  // CHECK ML SUCCESS
  // ==========================================================

  if (!result.success) {

    throw new Error(
      result.error ||
      "ML recommendation failed"
    );
  }


  // ==========================================================
  // MAP ML RESULTS BACK TO REAL EVENTS
  // ==========================================================

  const recommendedEvents =
    (result.data || []).map(
      (recommendation) => {

        const originalEvent =
          events.find(
            (event) =>
              event.id ===
              Number(
                recommendation.event_id
              )
          );


        // Safety check
        if (!originalEvent) {
          return null;
        }


        return {

          ...originalEvent,

          recommendationScore:
            recommendation.recommendation_score

        };

      }
    )
    .filter(Boolean);


  return recommendedEvents;
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getRecommendations
};