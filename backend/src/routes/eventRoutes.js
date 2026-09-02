const express = require("express");

const {
  getEvents,
  getEvent,
  createEventController,
  updateEventController,
  deleteEventController,
  searchEventsController,
  getEventsByCategoryController,
} = require("../controllers/eventController");

const router = express.Router();

router.get("/", getEvents);

router.get("/search", searchEventsController);

router.get("/category/:category", getEventsByCategoryController);

router.get("/:id", getEvent);

router.post("/", createEventController);

router.put("/:id", updateEventController);

router.delete("/:id", deleteEventController);

module.exports = router;