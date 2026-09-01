const express = require("express");

const router = express.Router();

const {
    saveInteraction,
    getUserInteractions
} = require("../controllers/interactionController");

router.post("/", saveInteraction);

router.get("/:userId", getUserInteractions);

module.exports = router;