const express = require("express");
const router = express.Router();
const User = require("../models/User");


// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ message: "User already exists" });
    }

    const user = new User({
      name,
      email,
      password,
      role,
      status: "pending"   // approval required
    });

    await user.save();

    res.json({
      message: "Signup successful. Wait for approval."
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.json({ message: "Invalid credentials" });
    }

    if (user.status !== "approved") {
      return res.json({ message: "Wait for approval" });
    }

    res.json({
      message: "Login success",
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= GET PENDING USERS =================
router.get("/pending", async (req, res) => {
  try {
    const users = await User.find({ status: "pending" });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= APPROVE USER =================
router.put("/approve/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: "approved" });
    res.json({ message: "User approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= REJECT USER =================
router.delete("/reject/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;