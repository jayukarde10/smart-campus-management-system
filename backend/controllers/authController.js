const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const name = req.body?.name;
    const email = req.body?.email;
    const password = req.body?.password;
    const role = req.body?.role || "student";

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Missing data",
        received: req.body
      });
    }

    // Only allow student or faculty registration (admin is seeded)
    if (!["student", "faculty"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Only student or faculty registration is allowed." });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Faculty accounts need admin approval; students are approved immediately
    const status = role === "faculty" ? "pending" : "approved";

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      status
    });

    await user.save();

    const message = role === "faculty" 
      ? "Faculty account created successfully. Please wait for administrator approval before logging in."
      : "User registered successfully";

    res.status(201).json({
      message,
      user: { name, email, role, status }
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password, requestedRole } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate role matches if requestedRole is provided
    if (requestedRole && user.role !== requestedRole) {
      return res.status(403).json({ 
        message: `This account is registered as ${user.role}. Please use the ${user.role} login.` 
      });
    }

    // Check faculty approval status
    if (user.role === "faculty" && user.status === "pending") {
      return res.status(403).json({ 
        message: "Your faculty account is awaiting administrator approval. Please contact the principal." 
      });
    }

    if (user.role === "faculty" && user.status === "rejected") {
      return res.status(403).json({ 
        message: "Your faculty account was not approved. Please contact the administration." 
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email, avatar: user.avatar || null },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};