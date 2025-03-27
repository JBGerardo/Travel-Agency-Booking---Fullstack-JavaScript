const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  addBooking,
  getCurrentUserBookings,
  getUserBookings,
  updateBookingStatus,
  cancelBooking
} = require("../controllers/bookingController");

// @route   POST /api/bookings
// @desc    Create a booking (current user)
// @access  Private
router.post("/", authMiddleware, addBooking);

// @route   GET /api/bookings
// @desc    Get current logged-in user's bookings
// @access  Private
router.get("/", authMiddleware, getCurrentUserBookings);

// @route   GET /api/bookings/user/:userId
// @desc    Get bookings for a specific user (admin use)
// @access  Private
router.get("/user/:userId", authMiddleware, getUserBookings);

// @route   PUT /api/bookings/update/:bookingId
// @desc    Update booking status after payment
// @access  Private
router.put("/update/:bookingId", authMiddleware, updateBookingStatus);

// @route   PUT /api/bookings/cancel/:id
// @desc    Cancel a booking and notify user
// @access  Private
router.put("/cancel/:id", authMiddleware, cancelBooking);

module.exports = router;
