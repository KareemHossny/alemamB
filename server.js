const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const connectingDB = require("./config/mongo");

dotenv.config();

const app = express();

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://alemam.vercel.app",
  "https://alemam-b.vercel.app",
  "https://alemam-b-kareems-projects-cc09171a.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
(async () => {
  try {
    if (typeof connectingDB === "function") {
      await connectingDB();
      console.log("✅ Connected to MongoDB");
    }
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1);
  }
})();

// Routes
app.use("/api/user", require("./routes/user"));
app.use("/api/projects", require("./routes/project"));
app.use("/api/workers", require("./routes/worker"));
app.use("/api/monthly-data", require("./routes/monthlyWorker"));
app.use("/api/project-workers", require("./routes/projectWorker"));

app.get("/", (req, res) => {
  res.json({ message: "🚀 AlEmam API is running securely..." });
});

// Start server (except in serverless environments like Vercel)
const PORT = process.env.PORT || 5000;
if (process.env.VERCEL !== "1") {
  app.listen(PORT, (err) => {
    if (err) {
      console.error("Error starting server:", err);
      return;
    }
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
