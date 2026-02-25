const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  rollNo: Number,
  name: String,
  email: String,
  phone: Number,
  course: String,
  year: String,
  status: { type: String, default: "Active" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Student", StudentSchema);