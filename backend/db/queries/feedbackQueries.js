const { prisma } = require("../connection");

const createFeedback = async (userId, eventId, experience) => {
  return await prisma.feedback.create({
    data: {
      userId: Number(userId),
      eventId: Number(eventId),
      experience
    },
    include: {
      event: true
    }
  });
};

const getUserFeedback = async (userId) => {
  return await prisma.feedback.findMany({
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

const getEventFeedback = async (eventId) => {
  return await prisma.feedback.findMany({
    where: {
      eventId: Number(eventId)
    }
  });
};

module.exports = {
  createFeedback,
  getUserFeedback,
  getEventFeedback
};