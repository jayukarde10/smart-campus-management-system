const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
const Fee = require("../models/Fee");
const Event = require("../models/Event");
const Notice = require("../models/Notice");

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"))
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ============ STATS ============

router.get("/stats", authMiddleware, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalFaculty = await User.countDocuments({ role: "faculty", status: "approved" });
    const pendingFaculty = await User.countDocuments({ role: "faculty", status: "pending" });
    res.json({ totalUsers, totalStudents, totalFaculty, pendingFaculty });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ============ USER MANAGEMENT ============

router.get("/users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Filtered user lists for clickable stats
router.get("/users/students", authMiddleware, adminOnly, async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password").sort({ name: 1 });
    res.json(students);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get("/users/faculty", authMiddleware, adminOnly, async (req, res) => {
  try {
    const faculty = await User.find({ role: "faculty" }).select("-password").sort({ name: 1 });
    res.json(faculty);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ============ FACULTY APPROVAL ============

router.get("/faculty/pending", authMiddleware, adminOnly, async (req, res) => {
  try {
    const pending = await User.find({ role: "faculty", status: "pending" }).select("-password").sort({ createdAt: -1 });
    res.json(pending);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put("/faculty/:id/approve", authMiddleware, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: "approved" });
    res.json({ message: "Faculty approved" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put("/faculty/:id/reject", authMiddleware, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: "rejected" });
    res.json({ message: "Faculty rejected" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete("/faculty/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ============ FEES MANAGEMENT ============

router.get("/fees", authMiddleware, adminOnly, async (req, res) => {
  try {
    const fees = await Fee.find().sort({ createdAt: -1 });
    res.json(fees);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post("/fees", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { studentId, studentName, studentEmail, feeType, amount, paid, status, dueDate, semester } = req.body;
    if (!studentId || !feeType || !amount) {
      return res.status(400).json({ message: "Student, fee type, and amount required" });
    }
    const fee = new Fee({
      studentId, studentName, studentEmail,
      feeType, amount: Number(amount), paid: Number(paid) || 0,
      status: status || "pending", dueDate: dueDate || "",
      semester: semester || "Current", assignedBy: req.user.id
    });
    await fee.save();
    res.status(201).json({ message: "Fee assigned", fee });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.put("/fees/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const updated = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Fee updated", fee: updated });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete("/fees/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await Fee.findByIdAndDelete(req.params.id);
    res.json({ message: "Fee deleted" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ============ EVENTS (Admin) ============

router.post("/events", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, description, date, time, location, category } = req.body;
    if (!title || !date) return res.status(400).json({ message: "Title and date required" });
    const event = new Event({
      title, description, date, time, location,
      category: category || "General",
      createdBy: req.user.id,
      createdByName: req.user.name || "Administrator",
      createdByRole: "admin"
    });
    await event.save();
    res.status(201).json({ message: "Event created", event });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get("/events", authMiddleware, adminOnly, async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete("/events/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ============ NOTICES (Admin) ============

router.post("/notices", authMiddleware, adminOnly, upload.single("file"), async (req, res) => {
  try {
    const { title, content, type } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });
    const notice = new Notice({
      title, content: content || "", type: type || "notice",
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
      fileName: req.file ? req.file.originalname : null,
      createdBy: req.user.id, createdByName: "Administrator"
    });
    await notice.save();
    res.status(201).json({ message: "Notice published", notice });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Get all students (for fee assignment dropdown)
router.get("/students", authMiddleware, adminOnly, async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password").sort({ name: 1 });
    res.json(students);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
