const express = require("express");

const {
  saveSearch,
  getSearchHistory,
  getRecentSearchHistory,
  clearSearchHistory,
} = require("../controllers/searchController");

const router = express.Router();

router.post("/", saveSearch);

router.get("/user/:userId", getSearchHistory);

router.get("/user/:userId/recent", getRecentSearchHistory);

router.delete("/user/:userId", clearSearchHistory);

module.exports = router;