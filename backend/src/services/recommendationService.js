const prisma = require("../../db/connection");

const getRecommendations = async (userId) => {
  const numericUserId = Number(userId);

  if (!Number.isInteger(numericUserId)) {
    throw new Error("Invalid user ID");
  }

  const [events, interactions, searches] = await Promise.all([
    prisma.event.findMany({
      orderBy: {
        date: "asc",
      },
    }),

    prisma.interaction.findMany({
      where: {
        userId: numericUserId,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.searchHistory.findMany({
      where: {
        userId: numericUserId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    }),
  ]);

  /*
    ML MODEL INTEGRATION GOES HERE.

    Later:

    const recommendations = await model.predict({
      userId: numericUserId,
      events,
      interactions,
      searches
    });

    return recommendations;
  */

  return events.slice(0, 20);
};

module.exports = {
  getRecommendations,
};