const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Marks = require("../models/Marks");
const Timetable = require("../models/Timetable");
const Notice = require("../models/Notice");
const Fee = require("../models/Fee");
const Event = require("../models/Event");

const studentOnly = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Student access required" });
  }
  next();
};

router.get("/marks", authMiddleware, studentOnly, async (req, res) => {
  try {
    const marks = await Marks.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    res.json(marks);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get("/timetable", authMiddleware, studentOnly, async (req, res) => {
  try {
    const timetable = await Timetable.find().sort({ day: 1 });
    res.json(timetable);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get("/notices", authMiddleware, studentOnly, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get("/fees", authMiddleware, studentOnly, async (req, res) => {
  try {
    const fees = await Fee.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    res.json(fees);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get("/events", authMiddleware, studentOnly, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
