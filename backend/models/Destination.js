const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String } // Will store image URL or path
});

module.exports = mongoose.model("Destination", DestinationSchema);
