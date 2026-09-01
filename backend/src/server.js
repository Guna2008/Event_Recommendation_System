const express = require("express");
const cors = require("cors");
require("dotenv").config();

const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const searchRoutes = require("./routes/searchRoutes");
const interactionRoutes = require("./routes/interactionRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "Event Recommendation System API is running"
    });
});

// API routes
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/recommendations", recommendationRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});