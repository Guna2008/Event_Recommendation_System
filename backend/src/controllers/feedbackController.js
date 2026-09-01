const {
  createFeedback,
  getFeedbackById,
  getUserFeedback,
  getEventFeedback,
  deleteFeedback,
} = require("../../db/queries/feedbackQueries");

const submitFeedback = async (req, res) => {
  try {
    const {
      registrationId,
      userId,
      eventId,
      experience,
    } = req.body;

    if (
      !registrationId ||
      !userId ||
      !eventId ||
      !experience
    ) {
      return res.status(400).json({
        success: false,
        message:
          "registrationId, userId, eventId and experience are required",
      });
    }

    const feedback = await createFeedback({
      registrationId,
      userId,
      eventId,
      experience,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit feedback",
    });
  }
};

const getFeedback = async (req, res) => {
  try {
    const feedback = await getFeedbackById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
    });
  }
};

const getUserFeedbackController = async (req, res) => {
  try {
    const feedback = await getUserFeedback(req.params.userId);

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user feedback",
    });
  }
};

const getEventFeedbackController = async (req, res) => {
  try {
    const feedback = await getEventFeedback(req.params.eventId);

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch event feedback",
    });
  }
};

const removeFeedback = async (req, res) => {
  try {
    const feedback = await getFeedbackById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    await deleteFeedback(req.params.id);

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete feedback",
    });
  }
};

module.exports = {
  submitFeedback,
  getFeedback,
  getUserFeedbackController,
  getEventFeedbackController,
  removeFeedback,
};