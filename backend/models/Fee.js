const mongoose = require("mongoose");

const FeeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  studentName: { type: String, default: "" },
  studentEmail: { type: String, default: "" },
  feeType: { type: String, required: true },
  amount: { type: Number, required: true },
  paid: { type: Number, default: 0 },
  status: { type: String, enum: ["pending", "partial", "paid"], default: "pending" },
  dueDate: { type: String, default: "" },
  semester: { type: String, default: "Current" },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Fee", FeeSchema);
