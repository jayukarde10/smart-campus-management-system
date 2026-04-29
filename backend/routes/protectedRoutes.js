const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const path    = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// ── Multer for avatars ──────────────────────────────────
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.user.id}_${Date.now()}${ext}`);
  }
});
const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files allowed for avatar"), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// ── Dashboard (legacy) ──────────────────────────────────
router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to dashboard", user: req.user });
});

// ── GET /api/profile — fetch current user's profile ────
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ── PUT /api/profile — update profile fields ────────────
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, phone, department, year, address, bio } = req.body;
    const update = {};
    if (name)       update.name       = name;
    if (phone       !== undefined) update.phone       = phone;
    if (department  !== undefined) update.department  = department;
    if (year        !== undefined) update.year        = year;
    if (address     !== undefined) update.address     = address;
    if (bio         !== undefined) update.bio         = bio;

    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select("-password");
    res.json({ message: "Profile updated", user });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ── POST /api/profile/avatar — upload profile photo ─────
router.post("/profile/avatar", authMiddleware, avatarUpload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });
    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    ).select("-password");
    res.json({ message: "Avatar updated", avatar: avatarUrl, user });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;