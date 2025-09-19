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
      // لو مفيش origin (مثلاً Postman أو curl) اسمح عادي
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
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
if (process.env.VERCEL !== "1") {
  app.listen(PORT, (err) => {
    if (err) {
      console.error('Error starting server:', err);
      return;
    }
    console.log(`Server is running on port ${PORT}`);
  });
}





