const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const authMiddleware = require("../middleware/authMiddleware");

// Make a payment (Protected Route)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { amount, paymentMethod } = req.body;

        const payment = new Payment({
            user: req.user.userId,
            amount,
            paymentMethod,
            status: "completed"
        });

        await payment.save();
        res.status(201).json({ message: "Payment successful", payment });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Get all payments for a user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const payments = await Payment.find({ user: req.user.userId });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
