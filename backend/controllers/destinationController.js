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

// Get a destination by ID
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

// Create a new destination (Admin Only)
exports.createDestination = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized, admin access required" });
    }

    const { name, location, price, description, image } = req.body;
    const destination = new Destination({ name, location, price, description, image });

    await destination.save();
    res.status(201).json({ message: "Destination added successfully", destination });
  } catch (error) {
    console.error("Error adding destination:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update image for a destination
exports.updateDestinationImage = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    const { image } = req.body;
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      { image },
      { new: true }
    );

    if (!destination) {
      return res.status(404).json({ message: "Destination not found." });
    }

    res.json({ message: "Image updated successfully", destination });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Update entire destination object
exports.updateDestination = async (req, res) => {
  try {
    const updated = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Destination not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error("Error updating destination:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete destination (Admin Only)
exports.deleteDestination = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const deleted = await Destination.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.json({ message: "Destination deleted successfully" });
  } catch (error) {
    console.error("Error deleting destination:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
