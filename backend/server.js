const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ IMPORT ROUTES (CHECK PATHS)
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");

// middleware
app.use(cors());
app.use(express.json());

// DB connect
mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ✅ USE ROUTES
app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));