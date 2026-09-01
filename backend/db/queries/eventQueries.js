const prisma = require("../connection");

// Get all events
const getAllEvents = async () => {
  return await prisma.event.findMany({
    orderBy: {
      date: "asc"
    }
  });
};

// Get event by ID
const getEventById = async (id) => {
  return await prisma.event.findUnique({
    where: {
      id: Number(id)
    }
  });
};

// Search events
const searchEvents = async (search) => {
  return await prisma.event.findMany({
    where: {
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          domain: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          location: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          organizerName: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    },
    orderBy: {
      date: "asc"
    }
  });
};

// Get events by domain
const getEventsByDomain = async (domain) => {
  return await prisma.event.findMany({
    where: {
      domain: {
        equals: domain,
        mode: "insensitive"
      }
    },
    orderBy: {
      date: "asc"
    }
  });
};

// Create an event
const createEvent = async (eventData) => {
  return await prisma.event.create({
    data: eventData
  });
};

// Update an event
const updateEvent = async (id, eventData) => {
  return await prisma.event.update({
    where: {
      id: Number(id)
    },
    data: eventData
  });
};

// Delete an event
const deleteEvent = async (id) => {
  return await prisma.event.delete({
    where: {
      id: Number(id)
    }
  });
};

// Delete events whose registration deadline has passed
const deleteExpiredEvents = async () => {
  return await prisma.event.deleteMany({
    where: {
      registrationDeadline: {
        lt: new Date()
      }
    }
  });
};

module.exports = {
  getAllEvents,
  getEventById,
  searchEvents,
  getEventsByDomain,
  createEvent,
  updateEvent,
  deleteEvent,
  deleteExpiredEvents
};