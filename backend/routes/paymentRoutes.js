const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createCheckoutSession,
  handlePaymentSuccess
} = require("../controllers/paymentController");

// @route   POST /api/payments/create-checkout-session
// @desc    Create Stripe checkout session and store payment
// @access  Private
router.post("/create-checkout-session", authMiddleware, createCheckoutSession);

// @route   GET /api/payments/success
// @desc    Handle Stripe payment success
// @access  Public
router.get("/success", handlePaymentSuccess);

module.exports = router;
