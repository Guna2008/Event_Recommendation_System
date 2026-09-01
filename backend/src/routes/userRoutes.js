
const express = require("express");

const {
  getUser,
  createUser,
  updateUser
} = require("../controllers/userController");

const router = express.Router();

router.get("/:id", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);

module.exports = router;