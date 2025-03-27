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
// Update destination details by ID (admin only)
exports.updateDestination = async (req, res) => {
  try {
    const updated = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Destination not found" });
    res.json({ message: "Destination updated successfully", destination: updated });
  } catch (err) {
    console.error("Error updating destination:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Delete destination by ID (admin only)
exports.deleteDestination = async (req, res) => {
  try {
    const deleted = await Destination.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Destination not found" });
    res.json({ message: "Destination deleted successfully" });
  } catch (err) {
    console.error("Error deleting destination:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
