const Booking = require("../models/Booking");
const Destination = require("../models/Destination");

exports.addBooking = async (req, res) => {
  try {
    const { user, destination, date } = req.body;

    // Validate input fields
    if (!user || !destination || !date) {
      return res.status(400).json({ message: "All fields (user, destination, date) are required." });
    }

    // Check if the destination exists
    const destinationExists = await Destination.findById(destination);
    if (!destinationExists) {
      return res.status(404).json({ message: "Destination not found." });
    }

    // Create a new booking
    const booking = new Booking({
      user,
      destination,
      date: new Date(date), // Ensure it's stored as a Date object
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
      const bookings = await Booking.find({ user: userId }).populate("destination");
  
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  exports.cancelBooking = async (req, res) => {
    try {
      const bookingId = req.params.id;
  
      // Find and update the booking status to "cancelled"
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: "cancelled" },
        { new: true }
      );
  
      if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
      }
  
      res.json({ message: "Booking cancelled successfully", booking });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
