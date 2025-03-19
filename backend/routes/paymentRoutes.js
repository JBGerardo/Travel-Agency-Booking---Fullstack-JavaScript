const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/Booking");
const router = express.Router();

router.post("/checkout", async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Find the booking
    const booking = await Booking.findById(bookingId).populate("destination");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payments/success?bookingId=${bookingId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payments/cancel`,
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
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
