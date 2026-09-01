const express = require("express");

const {
  submitFeedback,
  getFeedback,
  getUserFeedbackController,
  getEventFeedbackController,
  removeFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();

router.post("/", submitFeedback);

router.get("/:id", getFeedback);

router.get("/user/:userId", getUserFeedbackController);

router.get("/event/:eventId", getEventFeedbackController);

router.delete("/:id", removeFeedback);

module.exports = router;