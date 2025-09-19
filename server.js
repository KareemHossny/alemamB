const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const connectingDB = require("./config/mongo");

dotenv.config();

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "https://alemam.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // لو مفيش origin (زي Postman) اسمح عادي
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true); // اسمح
      } else {
        callback(new Error("Not allowed by CORS")); // ارفض
      }
    },
    credentials: true,
  })
);



// Connect to MongoDB
if (typeof connectingDB === "function") connectingDB();

// Routes
app.use("/api/user", require("./routes/user")); 
app.use("/api/projects", require("./routes/project")); 
app.use("/api/workers", require("./routes/worker")); 
app.use("/api/monthly-data", require("./routes/monthlyWorker")); 
app.use("/api/project-workers", require("./routes/projectWorker")); 

app.get("/", (req, res) => {
  res.send("🚀 AlEmam API is running securely...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));






