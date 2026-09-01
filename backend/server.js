const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ================================
// IMPORT QUERY FUNCTIONS
// ================================

const {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser
} = require("./db/queries/userqueries");

const {
  getAllEvents,
  getEventById,
  searchEvents,
  getEventsByCategory,
  createEvent,
  updateEvent,
  deleteEvent,
  deleteExpiredEvents
} = require("./db/queries/eventqueries");


// ================================
// HOME
// ================================

app.get("/", (req, res) => {
  res.json({
    message: "Event Recommendation Backend is running"
  });
});


// ================================
// USER APIs
// ================================

// Create user
app.post("/users", async (req, res) => {
  try {
    const user = await createUser(req.body);

    res.status(201).json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create user"
    });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get users"
    });
  }
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get user"
    });
  }
});

// Get user by email
app.get("/users/email/:email", async (req, res) => {
  try {
    const user = await getUserByEmail(req.params.email);

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get user"
    });
  }
});

// Update user
app.put("/users/:id", async (req, res) => {
  try {
    const user = await updateUser(
      req.params.id,
      req.body
    );

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update user"
    });
  }
});

// Delete user
app.delete("/users/:id", async (req, res) => {
  try {
    await deleteUser(req.params.id);

    res.json({
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete user"
    });
  }
});


// ================================
// EVENT APIs
// ================================

// Get all events
app.get("/events", async (req, res) => {
  try {
    const events = await getAllEvents();

    res.json(events);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get events"
    });
  }
});

// Get event by ID
app.get("/events/:id", async (req, res) => {
  try {
    const event = await getEventById(req.params.id);

    if (!event) {
      return res.status(404).json({
        error: "Event not found"
      });
    }

    res.json(event);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get event"
    });
  }
});

// Search events
app.get("/events/search/:search", async (req, res) => {
  try {
    const events = await searchEvents(req.params.search);

    res.json(events);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to search events"
    });
  }
});

// Get events by category
app.get("/events/category/:category", async (req, res) => {
  try {
    const events = await getEventsByCategory(
      req.params.category
    );

    res.json(events);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get events by category"
    });
  }
});

// Create event - ADMIN
app.post("/events", async (req, res) => {
  try {
    const event = await createEvent(req.body);

    res.status(201).json(event);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create event"
    });
  }
});

// Update event - ADMIN
app.put("/events/:id", async (req, res) => {
  try {
    const event = await updateEvent(
      req.params.id,
      req.body
    );

    res.json(event);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update event"
    });
  }
});

// Delete event - ADMIN
app.delete("/events/:id", async (req, res) => {
  try {
    await deleteEvent(req.params.id);

    res.json({
      message: "Event deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete event"
    });
  }
});


// ================================
// AUTOMATICALLY DELETE EXPIRED EVENTS
// ================================

const removeExpiredEvents = async () => {
  try {
    const result = await deleteExpiredEvents();

    if (result.count > 0) {
      console.log(
        `${result.count} expired event(s) deleted`
      );
    }
  } catch (error) {
    console.error(
      "Failed to delete expired events:",
      error
    );
  }
};

// Check once when server starts
removeExpiredEvents();

// Check every 1 hour
setInterval(
  removeExpiredEvents,
  60 * 60 * 1000
);


// ================================
// START SERVER
// ================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});