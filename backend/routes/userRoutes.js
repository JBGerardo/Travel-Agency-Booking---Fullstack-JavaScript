const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  addToFavorites,
  removeFromFavorites,
  getFavorites
} = require("../controllers/userController");

// @route   POST /api/users/favorites/:destinationId
// @desc    Add a destination to user's favorites
// @access  Private
router.post("/favorites/:destinationId", authMiddleware, addToFavorites);

// @route   DELETE /api/users/favorites/:destinationId
// @desc    Remove a destination from user's favorites
// @access  Private
router.delete("/favorites/:destinationId", authMiddleware, removeFromFavorites);

// @route   GET /api/users/favorites
// @desc    Get all favorite destinations
// @access  Private
router.get("/favorites", authMiddleware, getFavorites);

module.exports = router;
