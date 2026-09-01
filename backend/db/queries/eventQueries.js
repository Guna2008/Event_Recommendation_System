const prisma = require("../connection");

// ================================
// GET ALL EVENTS
// ================================

const getAllEvents = async () => {
  return await prisma.event.findMany({
    orderBy: {
      date: "asc",
    },
  });
};


// ================================
// GET EVENT BY ID
// ================================

const getEventById = async (id) => {
  return await prisma.event.findUnique({
    where: {
      id: Number(id)
    }
  });
};


// ================================
// SEARCH EVENTS
// ================================

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
          location: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          domain: {
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


// ================================
// GET EVENTS BY CATEGORY
// ================================

const getEventsByCategory = async (category) => {
  return await prisma.event.findMany({
    where: {
      domain: {
        equals: category,
        mode: "insensitive"
      }
    },
    orderBy: {
      date: "asc"
    }
  });
};


// ================================
// CREATE EVENT
// ================================

const createEvent = async (data) => {
  return await prisma.event.create({
    data: {
      title: data.title,
      date: data.date ? new Date(data.date) : null,
      location: data.location,
      domain: data.domain,
      startTime: data.startTime,
      endTime: data.endTime,
      registrationFee: data.registrationFee,
      cashPrize: data.cashPrize,
      certificateAvailable: data.certificateAvailable || false,
      posterUrl: data.posterUrl,
      registrationUrl: data.registrationUrl,
      whatsappGroupLink: data.whatsappGroupLink,
      contactNumber: data.contactNumber,
      contactEmail: data.contactEmail,
      organizerName: data.organizerName,
      organizerDepartment: data.organizerDepartment,
      description: data.description,
      registrationDeadline: data.registrationDeadline
        ? new Date(data.registrationDeadline)
        : null
    }
  });
};


// ================================
// UPDATE EVENT
// ================================

const updateEvent = async (id, data) => {
  return await prisma.event.update({
    where: {
      id: Number(id)
    },
    data: {
      title: data.title,
      date: data.date ? new Date(data.date) : undefined,
      location: data.location,
      domain: data.domain,
      startTime: data.startTime,
      endTime: data.endTime,
      registrationFee: data.registrationFee,
      cashPrize: data.cashPrize,
      certificateAvailable: data.certificateAvailable,
      posterUrl: data.posterUrl,
      registrationUrl: data.registrationUrl,
      whatsappGroupLink: data.whatsappGroupLink,
      contactNumber: data.contactNumber,
      contactEmail: data.contactEmail,
      organizerName: data.organizerName,
      organizerDepartment: data.organizerDepartment,
      description: data.description,
      registrationDeadline: data.registrationDeadline
        ? new Date(data.registrationDeadline)
        : undefined
    }
  });
};


// ================================
// DELETE EVENT
// ================================

const deleteEvent = async (id) => {
  return await prisma.event.delete({
    where: {
      id: Number(id)
    }
  });
};


// ================================
// DELETE EXPIRED EVENTS
// ================================

const deleteExpiredEvents = async () => {
  return await prisma.event.deleteMany({
    where: {
      date: {
        lt: new Date()
      }
    }
  });
};


// ================================
// EXPORT FUNCTIONS
// ================================

module.exports = {
  getAllEvents,
  getEventById,
  searchEvents,
  getEventsByCategory,
  createEvent,
  updateEvent,
  deleteEvent,
  deleteExpiredEvents
};