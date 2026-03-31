const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// 🔥 1. CORS FIRST
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors());

// 🔥 2. Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 3. Routes AFTER middleware
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

mongoose.connect("mongodb://127.0.0.1:27017/smartcampus")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});