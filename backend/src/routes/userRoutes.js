
const express = require("express");

const {
  getUser,
  createUser,
  loginUser,
  updateUser,
  removeUser
} = require("../controllers/userController");

const router = express.Router();

router.post("/login", loginUser);
router.get("/:id", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", removeUser);

module.exports = router;
