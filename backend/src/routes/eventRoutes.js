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

router.delete("/", async (req, res) => {
  const prisma = require("../../db/connection");
  try {
    await prisma.interaction.deleteMany();
    await prisma.feedback.deleteMany();
    await prisma.registration.deleteMany();
    await prisma.event.deleteMany();
    res.json({ success: true, message: "All events cleared." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to clear events." });
  }
});

router.delete("/:id", deleteEventController);

module.exports = router;