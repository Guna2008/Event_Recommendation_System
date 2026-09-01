const prisma = require("../connection");

// Add a search to search history
const createSearchHistory = async ({ userId, query }) => {
  return await prisma.searchHistory.create({
    data: {
      userId: Number(userId),
      query: query
    }
  });
};

// Get all searches made by a user
const getUserSearchHistory = async (userId) => {
  return await prisma.searchHistory.findMany({
    where: {
      userId: Number(userId)
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

// Get recent searches of a user
const getRecentSearches = async (userId, limit = 10) => {
  return await prisma.searchHistory.findMany({
    where: {
      userId: Number(userId)
    },
    orderBy: {
      createdAt: "desc"
    },
    take: Number(limit)
  });
};

// Delete a user's search history
const deleteUserSearchHistory = async (userId) => {
  return await prisma.searchHistory.deleteMany({
    where: {
      userId: Number(userId)
    }
  });
};

module.exports = {
  createSearchHistory,
  getUserSearchHistory,
  getRecentSearches,
  deleteUserSearchHistory
};