const express = require("express");

const {
  registerForEvent,
  getMyRegistrations,
  attendEvent,
  getCertificates
} = require("../controllers/registrationController");

const router = express.Router();

router.post("/", registerForEvent);

router.get("/user/:userId", getMyRegistrations);

router.get("/user/:userId/certificates", getCertificates);

router.put("/attendance", attendEvent);

module.exports = router;