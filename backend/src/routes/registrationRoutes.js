const express = require("express");

const {
  registerForEvent,
  getMyRegistrations,
  attendEvent
} = require("../controllers/registrationController");

const router = express.Router();

router.post("/", registerForEvent);

router.get("/user/:userId", getMyRegistrations);

router.put("/attendance", attendEvent);

module.exports = router;