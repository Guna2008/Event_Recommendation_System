const {
  getAllEvents,
  getEventByIdFromDB,
  createEventInDB
} = require("../../db/queries/eventQueries");

const getEvents = async (req, res) => {
  try {
    const events = await getAllEvents();

    res.status(200).json(events);
  } catch (error) {
    console.error("Get events error:", error);

    res.status(500).json({
      message: "Failed to fetch events"
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await getEventByIdFromDB(
      Number(req.params.id)
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Get event error:", error);

    res.status(500).json({
      message: "Failed to fetch event"
    });
  }
};

const createEvent = async (req, res) => {
  try {
    const event = await createEventInDB(req.body);

    res.status(201).json(event);
  } catch (error) {
    console.error("Create event error:", error);

    res.status(500).json({
      message: "Failed to create event"
    });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent
};