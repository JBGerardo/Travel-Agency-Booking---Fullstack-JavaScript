const Booking = require("../models/Booking");
const Destination = require("../models/Destination");
const sendEmail = require("../utils/sendEmail");

exports.addBooking = async (req, res) => {
  try {
    const { user, destination, date } = req.body;

    // Validate input fields
    if (!user || !destination || !date) {
      return res
        .status(400)
        .json({
          message: "All fields (user, destination, date) are required.",
        });
    }

    // Check if the destination exists
    const destinationExists = await Destination.findById(destination);
    if (!destinationExists) {
      return res.status(404).json({ message: "Destination not found." });
    }

    // Check if user has a cancelled booking for the same destination
    let existingBooking = await Booking.findOne({
      user,
      destination,
      status: "cancelled",
    });

    if (existingBooking) {
      existingBooking.status = "pending"; // Reactivate the booking
      existingBooking.date = new Date(date);
      await existingBooking.save();
      return res
        .status(200)
        .json({ message: "Booking reactivated", booking: existingBooking });
    }

    // Create a new booking
    const booking = new Booking({
      user,
      destination,
      date: new Date(date),
      status: "pending",
    });

    await booking.save();
    res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find bookings and populate the "destination" field to get full destination details
    const bookings = await Booking.find({ user: userId }).populate(
      "destination"
    );

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    // Populate the user field to access email
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "cancelled" },
      { new: true }
    ).populate("user");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    //  Ensure booking.user.email exists before calling sendEmail
    if (booking.user && booking.user.email) {
      await sendEmail(
        booking.user.email,
        "Booking Cancelled",
        `Hi ${booking.user.name},\n\nYour booking to ${booking.destination} has been cancelled.`
      );
    }

    res.json({ message: "Booking cancelled and user notified.", booking });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
