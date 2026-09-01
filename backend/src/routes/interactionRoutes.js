const express = require("express");

const {
  saveInteraction,
  getUserInteractionController,
  deleteInteractionController,
} = require("../controllers/interactionController");

const router = express.Router();

router.post("/", saveInteraction);

router.get("/user/:userId", getUserInteractionController);

router.delete("/:id", deleteInteractionController);

module.exports = router;