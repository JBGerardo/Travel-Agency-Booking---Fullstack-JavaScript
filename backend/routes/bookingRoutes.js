const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");
const { cancelBooking, getUserBookings } = require("../controllers/bookingController");

// Create a booking (Protected Route)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { destination, date } = req.body;

        const booking = new Booking({
            user: req.user.userId,
            destination,
            date
        });

        await booking.save();
        res.status(201).json({ message: "Booking created successfully", booking });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get all bookings for a user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.userId }).populate("destination");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});



// Get bookings for a specific user
router.get("/user/:userId", authMiddleware, getUserBookings);

//  Route to update booking status after payment
router.put("/update/:bookingId", authMiddleware, async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        // Find booking by ID
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Update status to confirmed
        booking.status = status || "confirmed";
        await booking.save();

        res.status(200).json({ message: "Booking updated successfully", booking });
    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// Cancel a booking by ID (Admin or User)
router.put("/cancel/:id", authMiddleware, cancelBooking);

module.exports = router;
