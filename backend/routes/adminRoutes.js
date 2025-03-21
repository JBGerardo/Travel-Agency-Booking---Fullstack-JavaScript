const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllBookings,
  getAllPayments,
  getAllUsers
} = require("../controllers/adminController");

//  Middleware to check admin access
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

//  View all bookings
router.get("/bookings", authMiddleware, requireAdmin, getAllBookings);

//  View all payments
router.get("/payments", authMiddleware, requireAdmin, getAllPayments);

//  View all users
router.get("/users", authMiddleware, requireAdmin, getAllUsers);

module.exports = router;