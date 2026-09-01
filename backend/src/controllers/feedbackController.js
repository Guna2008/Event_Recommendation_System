const {
  createFeedback,
  getUserFeedback,
  getEventFeedback
} = require("../../db/queries/feedbackQueries");

const submitFeedback = async (req, res) => {
  try {
    const {
      userId,
      eventId,
      experience
    } = req.body;

    if (!userId || !eventId || !experience) {
      return res.status(400).json({
        error: "userId, eventId and experience are required"
      });
    }

    const allowed = [
      "GOOD",
      "MODERATE",
      "BAD"
    ];

    const normalizedExperience =
      experience.toUpperCase();

    if (!allowed.includes(normalizedExperience)) {
      return res.status(400).json({
        error: "Experience must be GOOD, MODERATE or BAD"
      });
    }

    const feedback = await createFeedback(
      userId,
      eventId,
      normalizedExperience
    );

    res.status(201).json(feedback);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to submit feedback"
    });
  }
};

const getMyFeedback = async (req, res) => {
  try {
    const feedback = await getUserFeedback(
      req.params.userId
    );

    res.json(feedback);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get feedback"
    });
  }
};

const getFeedbackForEvent = async (req, res) => {
  try {
    const feedback = await getEventFeedback(
      req.params.eventId
    );

    res.json(feedback);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get event feedback"
    });
  }
};

module.exports = {
  submitFeedback,
  getMyFeedback,
  getFeedbackForEvent
};

