const express = require("express");

const {
  submitFeedback,
  getMyFeedback,
  getFeedbackForEvent
} = require("../controllers/feedbackcontroller");

const router = express.Router();

router.post("/", submitFeedback);

router.get("/user/:userId", getMyFeedback);

router.get("/event/:eventId", getFeedbackForEvent);

module.exports = router;