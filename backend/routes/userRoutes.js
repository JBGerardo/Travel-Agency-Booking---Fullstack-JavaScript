const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

//  Add to favorites
router.post("/favorites/:destinationId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const { destinationId } = req.params;

    if (!user.favorites.includes(destinationId)) {
      user.favorites.push(destinationId);
      await user.save();
    }

    res.json({ message: "Destination added to favorites" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

//  Remove from favorites
router.delete("/favorites/:destinationId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const { destinationId } = req.params;

    user.favorites = user.favorites.filter(
      (id) => id.toString() !== destinationId
    );

    await user.save();
    res.json({ message: "Destination removed from favorites" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ⭐ Get all favorite destinations
router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;
