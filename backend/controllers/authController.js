const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc    Register a new user
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, adminKey } = req.body;

    // Optional check for admin key
    if (role === "admin" && adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ message: "Invalid admin key." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Create and save new user
    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Log in user and return JWT token
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Get current user's profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
