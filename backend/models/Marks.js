const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  subject: { type: String, required: true },
  marks: { type: Number, required: true },
  totalMarks: { type: Number, required: true, default: 100 },
  examType: { type: String, enum: ["midterm", "final", "quiz", "assignment", "practical"], required: true },
  semester: { type: String, default: "Current" },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: { type: String, default: null },
  fileName: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Marks", marksSchema);
