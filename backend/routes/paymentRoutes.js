const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");

// Create a Stripe checkout session
router.post("/create-checkout-session", authMiddleware, async (req, res) => {
    try {
        const { bookingId } = req.body;

        // Fetch booking details
        const booking = await Booking.findById(bookingId).populate("destination");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: booking.destination.name,
                            description: booking.destination.description,
                        },
                        unit_amount: booking.destination.price * 100, // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/payments/success?bookingId=${bookingId}`,
            cancel_url: `${process.env.FRONTEND_URL}/payments/cancel`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe error:", error);
        res.status(500).json({ message: "Payment error", error });
    }
});

module.exports = router;
