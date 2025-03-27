const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getDestinations,
  getDestinationById,
  createDestination,
  updateDestinationImage,
  updateDestination,
  deleteDestination
} = require("../controllers/destinationController");

// @route   GET /api/destinations
// @desc    Get all destinations
// @access  Public
router.get("/", getDestinations);

// @route   GET /api/destinations/:id
// @desc    Get destination by ID
// @access  Public
router.get("/:id", getDestinationById);

// @route   POST /api/destinations
// @desc    Create a destination (Admin Only)
// @access  Private
router.post("/", authMiddleware, createDestination);

// @route   PUT /api/destinations/:id/image
// @desc    Update image for a destination
// @access  Private (Admin)
router.put("/:id/image", authMiddleware, updateDestinationImage);

// @route   PUT /api/destinations/:id
// @desc    Update entire destination info
// @access  Private (Admin)
router.put("/:id", authMiddleware, updateDestination);

// @route   DELETE /api/destinations/:id
// @desc    Delete destination (Admin Only)
// @access  Private
router.delete("/:id", authMiddleware, deleteDestination);

module.exports = router;
