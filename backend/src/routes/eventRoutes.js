const express = require("express");

const router = express.Router();

const {
    getAllEvents,
    getEventById,
    searchEvents,
    getEventsByCategory
} = require("../controllers/eventController");

router.get("/", getAllEvents);

router.get("/search", searchEvents);

router.get("/category/:category", getEventsByCategory);

router.get("/:id", getEventById);

module.exports = router;