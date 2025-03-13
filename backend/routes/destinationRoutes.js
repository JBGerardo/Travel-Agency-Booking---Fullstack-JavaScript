const express = require("express");
const router = express.Router();
const Destination = require("../models/Destination");
const authMiddleware = require("../middleware/authMiddleware");

// Get all destinations (Public Route)
router.get("/", async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.json(destinations);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Add a new destination (Admin Only)
router.post("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin") return res.status(403).json({ message: "Not authorized, admin access required" });

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
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
