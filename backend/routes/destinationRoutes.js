const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
} = require("../controllers/destinationController");
const Destination = require("../models/Destination");

// Route to get all destinations
router.get("/", getDestinations);

// Route to get a single destination by ID
router.get("/:id", getDestinationById);

// Add a new destination (Admin Only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized, admin access required" });
    }

    const { name, location, price, description, image } = req.body;

    const destination = new Destination({
      name,
      location,
      price,
      description,
      image,
    });

    await destination.save();
    res
      .status(201)
      .json({ message: "Destination added successfully", destination });
  } catch (error) {
    console.error("Error adding destination:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Update destination image by ID (admin only)
router.put("/:id/image", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied." });

    const { image } = req.body;
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      { image },
      { new: true }
    );

    if (!destination)
      return res.status(404).json({ message: "Destination not found." });

    res.json({ message: "Image updated successfully", destination });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

//Edit and Deleting Destination defined in destinationController// 
router.put("/:id", authMiddleware, updateDestination);
router.delete("/:id", authMiddleware, deleteDestination);

module.exports = router;
