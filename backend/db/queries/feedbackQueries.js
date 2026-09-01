const prisma = require("../connection");

const createFeedback = async ({
  registrationId,
  userId,
  eventId,
  experience,
}) => {
  const registration = await prisma.registration.findUnique({
    where: {
      id: Number(registrationId),
    },
  });

  if (!registration) {
    throw new Error("Registration not found");
  }

  if (registration.userId !== Number(userId)) {
    throw new Error("Registration does not belong to this user");
  }

  if (registration.eventId !== Number(eventId)) {
    throw new Error("Registration does not belong to this event");
  }

  const existingFeedback = await prisma.feedback.findUnique({
    where: {
      registrationId: Number(registrationId),
    },
  });

  if (existingFeedback) {
    throw new Error("Feedback already submitted for this registration");
  }

  return prisma.feedback.create({
    data: {
      registrationId: Number(registrationId),
      userId: Number(userId),
      eventId: Number(eventId),
      experience,
    },
  });
};

const getFeedbackById = async (id) => {
  return prisma.feedback.findUnique({
    where: {
      id: Number(id),
    },
  });
};

const getUserFeedback = async (userId) => {
  return prisma.feedback.findMany({
    where: {
      userId: Number(userId),
    },
    orderBy: {
      id: "desc",
    },
  });
};

const getEventFeedback = async (eventId) => {
  return prisma.feedback.findMany({
    where: {
      eventId: Number(eventId),
    },
    orderBy: {
      id: "desc",
    },
  });
};

const deleteFeedback = async (id) => {
  return prisma.feedback.delete({
    where: {
      id: Number(id),
    },
  });
};

module.exports = {
  createFeedback,
  getFeedbackById,
  getUserFeedback,
  getEventFeedback,
  deleteFeedback,
};