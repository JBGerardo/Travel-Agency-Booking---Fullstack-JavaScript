const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const User = require("../models/User");

//  Get all bookings with user and destination info
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")               // Join user data
      .populate("destination", "name location price"); // Join destination data
    res.json(bookings);
  } catch (error) {
    console.error("Admin bookings fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  Get all payments with user info
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("user", "name email");
    res.json(payments);
  } catch (error) {
    console.error("Admin payments fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  Get all users with name, email, and role
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role");
    res.json(users);
  } catch (error) {
    console.error("Admin users fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Export all admin controller functions
module.exports = {
  getAllBookings,
  getAllPayments,
  getAllUsers
};
