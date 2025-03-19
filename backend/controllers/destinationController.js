const Destination = require("../models/Destination");

// Get all destinations
exports.getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single destination by ID
exports.getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.json(destination);
  } catch (error) {
    console.error("Error fetching destination:", error);
    res.status(500).json({ message: "Server error" });
  }
};
