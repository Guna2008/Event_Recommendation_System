const prisma = require("../connection");

// Create an interaction
const createInteraction = async ({ userId, eventId, type }) => {
  return await prisma.interaction.create({
    data: {
      userId: Number(userId),
      eventId: Number(eventId),
      type: type
    }
  });
};

// Get all interactions of a user
const getUserInteractions = async (userId) => {
  return await prisma.interaction.findMany({
    where: {
      userId: Number(userId)
    },
    include: {
      event: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

// Get interactions for an event
const getEventInteractions = async (eventId) => {
  return await prisma.interaction.findMany({
    where: {
      eventId: Number(eventId)
    },
    include: {
      user: true
    }
  });
};

// Get user's interactions of a specific type
const getUserInteractionsByType = async (userId, type) => {
  return await prisma.interaction.findMany({
    where: {
      userId: Number(userId),
      type: type
    },
    include: {
      event: true
    }
  });
};

// Delete an interaction
const deleteInteraction = async (id) => {
  return await prisma.interaction.delete({
    where: {
      id: Number(id)
    }
  });
};

module.exports = {
  createInteraction,
  getUserInteractions,
  getEventInteractions,
  getUserInteractionsByType,
  deleteInteraction
};