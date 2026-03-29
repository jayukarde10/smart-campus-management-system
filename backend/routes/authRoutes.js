const express = require("express");
const router = express.Router();

// import full controller
const authController = require("../controllers/authController");

// debug (optional but helpful)
console.log("REGISTER:", typeof authController.register);
console.log("LOGIN:", typeof authController.login);

// routes
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;