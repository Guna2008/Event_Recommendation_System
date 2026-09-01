const {
  getUserById
} = require("../../db/queries/userQueries");

const {
  getAllEvents
} = require("../../db/queries/eventQueries");

const {
  getUserInteractions
} = require("../../db/queries/interactionQueries");

const {
  getUserSearchHistory
} = require("../../db/queries/searchQueries");

const generateRecommendations = async (userId) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const events = await getAllEvents();

  const interactions =
    await getUserInteractions(userId);

  const searchHistory =
    await getUserSearchHistory(userId);

  /*
    This is where the recommendation engine
    receives all required information.

    Friend 5/6 can plug their algorithm here.

    Inputs:

    user.skills
    user.interests
    user.preferredEventType
    user.preferredMode

    events

    interactions

    searchHistory
  */

  return events.slice(0, 20);
};

module.exports = {
  generateRecommendations
};