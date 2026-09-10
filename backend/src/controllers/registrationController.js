const {
  createRegistration,
  getRegistration,
  getUserRegistrations,
  markAttendance,
  getUserCertificates
} = require("../../db/queries/registrationQueries");

const registerForEvent = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    if (!userId || !eventId) {
      return res.status(400).json({
        error: "userId and eventId are required"
      });
    }

    const existing = await getRegistration(userId, eventId);

    if (existing) {
      return res.status(409).json({
        error: "User already registered for this event"
      });
    }

    const registration = await createRegistration(
      userId,
      eventId
    );

    res.status(201).json(registration);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to register for event"
    });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await getUserRegistrations(
      req.params.userId
    );

    res.json(registrations);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get registrations"
    });
  }
};

const attendEvent = async (req, res) => {
  try {
    const registration = await markAttendance(
      req.body.userId,
      req.body.eventId
    );

    res.json(registration);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to mark attendance"
    });
  }
};

const getCertificates = async (req, res) => {
  try {
    const certs = await getUserCertificates(req.params.userId);

    const data = certs.map(reg => ({
      id: reg.id,
      eventId: reg.eventId,
      title: reg.event.title,
      eventTitle: reg.event.title,
      date: reg.attendedAt
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get certificates" });
  }
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  attendEvent,
  getCertificates
};