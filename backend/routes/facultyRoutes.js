const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const Marks = require("../models/Marks");
const Timetable = require("../models/Timetable");
const Notice = require("../models/Notice");
const Event = require("../models/Event");
const User = require("../models/User");

const facultyOnly = (req, res, next) => {
  if (req.user.role !== "faculty") {
    return res.status(403).json({ message: "Faculty access required" });
  }
  next();
};

// Multer config — allow PDF and images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and image files are allowed"), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

// ============ MARKS ============

router.post("/marks", authMiddleware, facultyOnly, upload.single("file"), async (req, res) => {
  try {
    const { studentId, studentName, studentEmail, subject, marks, totalMarks, examType, semester } = req.body;
    if (!studentId || !subject || marks === undefined || !examType) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newMarks = new Marks({
      studentId, studentName: studentName || "", studentEmail: studentEmail || "",
      subject, marks: Number(marks), totalMarks: Number(totalMarks) || 100,
      examType, semester: semester || "Current", uploadedBy: req.user.id,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
      fileName: req.file ? req.file.originalname : null
    });
    await newMarks.save();
    res.status(201).json({ message: "Marks uploaded", marks: newMarks });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get("/marks", authMiddleware, facultyOnly, async (req, res) => {
  try {
    const marks = await Marks.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(marks);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete("/marks/:id", authMiddleware, facultyOnly, async (req, res) => {
  try {
    await Marks.findOneAndDelete({ _id: req.params.id, uploadedBy: req.user.id });
    res.json({ message: "Marks deleted" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ============ TIMETABLE ============

router.post("/timetable", authMiddleware, facultyOnly, async (req, res) => {
  try {
    const { day, periods, className } = req.body;
    if (!day || !periods || !Array.isArray(periods)) {
      return res.status(400).json({ message: "Day and periods are required" });
    }
    const timetable = await Timetable.findOneAndUpdate(
      { day, className: className || "General" },
      { day, periods, className: className || "General", createdBy: req.user.id },
      { upsert: true, new: true }
    );
    res.json({ message: "Timetable saved", timetable });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// POST /api/faculty/timetable/upload — Upload timetable image/PDF
router.post("/timetable/upload", authMiddleware, facultyOnly, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    // Store as a notice of type 'timetable' so students can see it
    const notice = new Notice({
      title: req.body.title || "Timetable Update",
      content: req.body.content || "Faculty has shared the timetable. Please download/view below.",
      type: "timetable",
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      createdBy: req.user.id,
      createdByName: req.user.name || "Faculty"
    });
    await notice.save();
    res.status(201).json({ message: "Timetable file shared to students", notice });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get("/timetable", authMiddleware, facultyOnly, async (req, res) => {
  try {
    const timetable = await Timetable.find().sort({ day: 1 });
    res.json(timetable);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ============ ATTENDANCE PDF UPLOAD ============

router.post("/attendance/upload", authMiddleware, facultyOnly, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const notice = new Notice({
      title: req.body.title || "Attendance Report",
      content: req.body.content || "Attendance report / defaulter list shared by faculty.",
      type: "attendance",
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      createdBy: req.user.id,
      createdByName: req.user.name || "Faculty"
    });
    await notice.save();
    res.status(201).json({ message: "Attendance PDF shared", notice });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ============ NOTICES ============

router.post("/notices", authMiddleware, facultyOnly, upload.single("file"), async (req, res) => {
  try {
    const { title, content, type } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    const notice = new Notice({
      title, content: content || "", type: type || "notice",
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
      fileName: req.file ? req.file.originalname : null,
      createdBy: req.user.id, createdByName: req.user.name || "Faculty"
    });
    await notice.save();
    res.status(201).json({ message: "Notice published", notice });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get("/notices", authMiddleware, facultyOnly, async (req, res) => {
  try {
    const notices = await Notice.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete("/notices/:id", authMiddleware, facultyOnly, async (req, res) => {
  try {
    await Notice.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    res.json({ message: "Notice deleted" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ============ EVENTS ============

router.post("/events", authMiddleware, facultyOnly, async (req, res) => {
  try {
    const { title, description, date, time, location, category } = req.body;
    if (!title || !date) return res.status(400).json({ message: "Title and date required" });
    const event = new Event({
      title, description: description || "", date, time: time || "",
      location: location || "", category: category || "General",
      createdBy: req.user.id, createdByName: req.user.name || "Faculty",
      createdByRole: "faculty"
    });
    await event.save();
    res.status(201).json({ message: "Event created", event });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.get("/events", authMiddleware, facultyOnly, async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete("/events/:id", authMiddleware, facultyOnly, async (req, res) => {
  try {
    await Event.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    res.json({ message: "Event deleted" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ============ STUDENTS MANAGEMENT (Faculty) ============

router.get("/students", authMiddleware, facultyOnly, async (req, res) => {
  try {
    const students = await User.find({ 
      role: "student",
      $or: [{ status: "approved" }, { status: { $exists: false } }]
    }).select("-password").sort({ name: 1 });
    res.json(students);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Edit student details
router.put("/students/:id", authMiddleware, facultyOnly, async (req, res) => {
  try {
    const { name, email, phone, department, year } = req.body;
    const student = await User.findOne({ _id: req.params.id, role: "student" });
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (name) student.name = name;
    if (email) student.email = email;
    if (phone !== undefined) student.phone = phone;
    if (department !== undefined) student.department = department;
    if (year !== undefined) student.year = year;
    await student.save();
    const updated = student.toObject();
    delete updated.password;
    res.json({ message: "Student updated", student: updated });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Delete student account
router.delete("/students/:id", authMiddleware, facultyOnly, async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: "student" });
    if (!student) return res.status(404).json({ message: "Student not found" });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Student account deleted" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
