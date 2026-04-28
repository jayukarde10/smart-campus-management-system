const mongoose = require("mongoose");

const periodSchema = new mongoose.Schema({
  time: { type: String, required: true },
  subject: { type: String, required: true },
  room: { type: String, default: "" },
  type: { type: String, enum: ["Lecture", "Practical", "Tutorial", "Break"], default: "Lecture" }
}, { _id: false });

const timetableSchema = new mongoose.Schema({
  day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], required: true },
  periods: [periodSchema],
  className: { type: String, default: "General" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

// Ensure one entry per day per class
timetableSchema.index({ day: 1, className: 1 }, { unique: true });

module.exports = mongoose.model("Timetable", timetableSchema);
