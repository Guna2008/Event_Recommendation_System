const prisma = require("../connection");

// Create a registration
const createRegistration = async (userId, eventId) => {
  return await prisma.registration.create({
    data: {
      userId: Number(userId),
      eventId: Number(eventId)
    },
    include: {
      event: true,
      user: true
    }
  });
};

// Get a specific registration
const getRegistration = async (userId, eventId) => {
  return await prisma.registration.findUnique({
    where: {
      userId_eventId: {
        userId: Number(userId),
        eventId: Number(eventId)
      }
    },
    include: {
      event: true
    }
  });
};

// Get all registrations of a user
const getUserRegistrations = async (userId) => {
  return await prisma.registration.findMany({
    where: {
      userId: Number(userId)
    },
    include: {
      event: true
    },
    orderBy: {
      registeredAt: "desc"
    }
  });
};

// Mark registration as attended
const markAttendance = async (userId, eventId) => {
  return await prisma.registration.update({
    where: {
      userId_eventId: {
        userId: Number(userId),
        eventId: Number(eventId)
      }
    },
    data: {
      status: "ATTENDED",
      attendedAt: new Date()
    }
  });
};

// Get attended registrations (certificates)
const getUserCertificates = async (userId) => {
  return await prisma.registration.findMany({
    where: {
      userId: Number(userId),
      status: "ATTENDED"
    },
    include: {
      event: true
    },
    orderBy: {
      attendedAt: "desc"
    }
  });
};

module.exports = {
  createRegistration,
  getRegistration,
  getUserRegistrations,
  markAttendance,
  getUserCertificates
};