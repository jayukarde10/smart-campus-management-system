const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: "" },
  type: { type: String, enum: ["event", "notice", "important", "timetable", "attendance"], default: "notice" },
  fileUrl: { type: String, default: null },
  fileName: { type: String, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdByName: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Notice", noticeSchema);
