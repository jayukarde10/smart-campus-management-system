const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "faculty", "admin"],
    default: "student"
  },
  status: {
    type: String,
    enum: ["approved", "pending", "rejected"],
    default: "approved"
  },
  // Profile extras
  phone:      { type: String, default: "" },
  department: { type: String, default: "" },
  year:       { type: String, default: "" },
  address:    { type: String, default: "" },
  bio:        { type: String, default: "" },
  avatar:     { type: String, default: null }   // URL to uploaded photo
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);