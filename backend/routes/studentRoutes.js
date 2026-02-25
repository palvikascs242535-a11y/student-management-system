const express = require('express');
const router = express.Router();
const Student = require('../models/Student');


// 🔐 ROLE PERMISSION MIDDLEWARE
function checkEditPermission(req, res, next) {

  const role = req.headers.role;   // role frontend se aayega

  // safety check
  if (!role) {
    return res.status(403).json({ message: "Role not provided" });
  }

  // user cannot edit/delete/add
  if (role === "user") {
    return res.status(403).json({ message: "Permission denied" });
  }

  // admin & boss allowed
  next();
}


// ===============================
// GET ALL STUDENTS (Everyone)
// ===============================
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ===============================
// ADD STUDENT (Admin & Boss)
// ===============================
router.post('/', checkEditPermission, async (req, res) => {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();
    res.json(savedStudent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ===============================
// UPDATE STUDENT (Admin & Boss)
// ===============================
router.put('/:id', checkEditPermission, async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ===============================
// DELETE STUDENT (Admin & Boss)
// ===============================
router.delete('/:id', checkEditPermission, async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;