const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  date: { type: String, required: true },
  time: { type: String, default: "" },
  location: { type: String, default: "" },
  category: { type: String, default: "General" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdByName: { type: String, default: "" },
  createdByRole: { type: String, default: "faculty" }
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
