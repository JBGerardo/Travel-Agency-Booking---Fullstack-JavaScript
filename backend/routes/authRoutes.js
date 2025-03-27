const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  getUserProfile
} = require("../controllers/authController");

// @route   POST /api/auth/register
// @desc    Register a new user (admin or regular)
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user and return token
// @access  Public
router.post("/login", loginUser);

// @route   GET /api/auth/profile
// @desc    Get current logged-in user's profile
// @access  Private
router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;
