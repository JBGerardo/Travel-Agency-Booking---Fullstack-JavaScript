const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getDestinations, getDestinationById } = require("../controllers/destinationController");
const Destination = require("../models/Destination"); 

// Route to get all destinations
router.get("/", getDestinations);

// Route to get a single destination by ID
router.get("/:id", getDestinationById);

// Add a new destination (Admin Only)
router.post("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized, admin access required" });
        }

        const { name, location, price, description, image } = req.body;

        const destination = new Destination({
            name,
            location,
            price,
            description,
            image
        });

        await destination.save();
        res.status(201).json({ message: "Destination added successfully", destination });
    } catch (error) {
        console.error("Error adding destination:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
