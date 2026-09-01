require("dotenv").config();

const registrationRoutes =require("./src/routes/registrationRoutes");

const feedbackRoutes =require("./src/routes/feedbackRoutes");
const express = require("express");
const cors = require("cors");

const eventRoutes = require("./src/routes/eventRoutes");
const userRoutes = require("./src/routes/userRoutes");
const interactionRoutes = require("./src/routes/interactionRoutes");
const searchRoutes = require("./src/routes/searchRoutes");
const recommendationRoutes = require("./src/routes/recommendationRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000"
  })
);

app.use(express.json());



app.get("/", (req, res) => {
  res.json({
    message: "Event Recommendation System API is running"
  });
});

app.use("/registrations", registrationRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/recommendations", recommendationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});