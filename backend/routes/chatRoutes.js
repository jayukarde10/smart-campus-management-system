const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const User = require("../models/User");

// GET /api/chat/contacts — Get users you can chat with
router.get("/contacts", authMiddleware, async (req, res) => {
  try {
    const myRole = req.user.role;
    let contacts;
    if (myRole === "student") {
      // Students can chat with approved faculty
      contacts = await User.find({ role: "faculty", status: "approved" }).select("-password");
    } else {
      // Faculty can chat with students
      contacts = await User.find({ 
        role: "student",
        $or: [{ status: "approved" }, { status: { $exists: false } }]
      }).select("-password");
    }

    // Get last message for each contact
    const enriched = await Promise.all(contacts.map(async (c) => {
      const lastMsg = await Message.findOne({
        $or: [
          { senderId: req.user.id, receiverId: c._id },
          { senderId: c._id, receiverId: req.user.id }
        ]
      }).sort({ createdAt: -1 });

      const unread = await Message.countDocuments({
        senderId: c._id, receiverId: req.user.id, read: false
      });

      return {
        _id: c._id,
        name: c.name,
        email: c.email,
        role: c.role,
        lastMessage: lastMsg?.text || "",
        lastMessageTime: lastMsg?.createdAt || null,
        unreadCount: unread
      };
    }));

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/chat/messages/:userId — Get messages with a specific user
router.get("/messages/:userId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user.id }
      ]
    }).sort({ createdAt: 1 });

    // Mark received messages as read
    await Message.updateMany(
      { senderId: req.params.userId, receiverId: req.user.id, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/chat/send — Send a message
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    if (!receiverId || !text) {
      return res.status(400).json({ message: "receiverId and text required" });
    }

    const msg = new Message({
      senderId: req.user.id,
      receiverId,
      text
    });
    await msg.save();
    res.status(201).json(msg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
