const User = require("../models/User");

// Add a destination to user's favorites
exports.addToFavorites = async (req, res) => {
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
};

// Remove a destination from user's favorites
exports.removeFromFavorites = async (req, res) => {
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
};

// Get all favorite destinations for the user
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};
