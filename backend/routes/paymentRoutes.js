const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const authMiddleware = require("../middleware/authMiddleware");

// Create a Stripe checkout session and store payment in MongoDB
router.post("/create-checkout-session", authMiddleware, async (req, res) => {
    try {
        const { bookingId, calculatedPrice } = req.body;

        // Validate required data
        if (!bookingId || !calculatedPrice) {
            return res.status(400).json({ message: "Booking ID and calculated price are required." });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }
        const userId = req.user.id;

        // Fetch booking details
        const booking = await Booking.findById(bookingId).populate("destination");
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
        const successUrl = `${CLIENT_URL}/payments/success?bookingId=${bookingId}`;
        const cancelUrl = `${CLIENT_URL}/payments/cancel`;

        // Step 1: Create Stripe Checkout Session using calculated price
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
                        unit_amount: Math.round(calculatedPrice * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        // Step 2: Save payment record with Stripe session ID
        const newPayment = new Payment({
            user: userId,
            booking: booking._id,
            amount: calculatedPrice,
            paymentMethod: "card",
            paymentIntentId: session.id,
            status: "pending",
        });

        await newPayment.save();

        // Send Stripe checkout session URL to frontend
        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe error:", error);
        res.status(500).json({ message: "Payment error", error });
    }
});

// Handle payment success and update payment and booking records
router.get("/success", async (req, res) => {
    try {
        const { bookingId } = req.query;

        // Find the payment associated with the booking
        const payment = await Payment.findOne({ booking: bookingId });

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        // Mark payment as completed
        payment.status = "completed";
        await payment.save();

        // Confirm the booking
        const booking = await Booking.findById(payment.booking);
        if (booking) {
            booking.status = "confirmed";
            await booking.save();
        }

        res.json({ message: "Payment successful", payment });
    } catch (error) {
        console.error("Error updating payment:", error);
        res.status(500).json({ message: "Error processing payment", error });
    }
});

module.exports = router;
