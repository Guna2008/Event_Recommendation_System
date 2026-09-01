const express = require("express");

const {
  createInteraction
} = require("../controllers/interactionController");

const router = express.Router();

router.post("/", createInteraction);

module.exports = router;