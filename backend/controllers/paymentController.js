const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");

// Create Stripe Checkout session
exports.createCheckoutSession = async (req, res) => {
  try {
    const { bookingId, calculatedPrice } = req.body;

    if (!bookingId || !calculatedPrice) {
      return res.status(400).json({ message: "Booking ID and calculated price are required." });
    }

    const userId = req.user.id;

    const booking = await Booking.findById(bookingId).populate("destination");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
    const successUrl = `${CLIENT_URL}/payments/success?bookingId=${bookingId}`;
    const cancelUrl = `${CLIENT_URL}/payments/cancel`;

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
            unit_amount: Math.round(calculatedPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    const newPayment = new Payment({
      user: userId,
      booking: booking._id,
      amount: calculatedPrice,
      paymentMethod: "card",
      paymentIntentId: session.id,
      status: "pending",
    });

    await newPayment.save();

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ message: "Payment error", error });
  }
};

// Handle Stripe success and update records
exports.handlePaymentSuccess = async (req, res) => {
  try {
    const { bookingId } = req.query;

    const payment = await Payment.findOne({ booking: bookingId });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = "completed";
    await payment.save();

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
};
