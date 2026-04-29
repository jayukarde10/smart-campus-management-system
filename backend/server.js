require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

const app = express();

// 1. CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 2. Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 4. Serve uploaded files statically
app.use("/uploads", express.static(uploadsDir));

// 5. Routes
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const adminRoutes = require("./routes/adminRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const studentRoutes = require("./routes/studentRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/chat", chatRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 6. Seed default admin account
const seedAdmin = async () => {
  const User = require("./models/User");
  try {
    const existingAdmin = await User.findOne({ email: "principal@gmail.com" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("123456", 10);
      const admin = new User({
        name: "Principal Administrator",
        email: "principal@gmail.com",
        password: hashedPassword,
        role: "admin",
        status: "approved"
      });
      await admin.save();
      console.log("✅ Default admin seeded: principal@gmail.com / 123456");
    } else {
      // Ensure existing admin has correct role and status
      if (existingAdmin.role !== "admin" || existingAdmin.status !== "approved") {
        existingAdmin.role = "admin";
        existingAdmin.status = "approved";
        await existingAdmin.save();
        console.log("✅ Admin account updated");
      }
      console.log("✅ Admin account exists");
    }
  } catch (error) {
    console.error("Admin seed error:", error.message);
  }
};

// Migrate old users: set status for users that don't have it
const migrateUsers = async () => {
  const User = require("./models/User");
  try {
    // Set status='approved' for all users that don't have a status field
    const result = await User.updateMany(
      { status: { $exists: false } },
      { $set: { status: "approved" } }
    );
    if (result.modifiedCount > 0) {
      console.log(`✅ Migrated ${result.modifiedCount} users (added status field)`);
    }

    // Also fix users with role not set (old registrations)
    const roleResult = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: "student" } }
    );
    if (roleResult.modifiedCount > 0) {
      console.log(`✅ Migrated ${roleResult.modifiedCount} users (added role field)`);
    }
  } catch (error) {
    console.error("Migration error:", error.message);
  }
};

// 7. Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smartcampus")
  .then(async () => {
    console.log("MongoDB Connected");
    await seedAdmin();
    await migrateUsers();
  })
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});