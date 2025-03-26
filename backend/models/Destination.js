const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String },
  placesOfInterest: [String],
  travelerNotes: {
    localCurrency: String,
    languageSpoken: String,
    timeZone: String,
    visaRequirement: String,
    localCuisineHighlights: [String],
    mustTryDishes: [String],
    festivalsAndEvents: [String]
  }
});

module.exports = mongoose.model("Destination", DestinationSchema);
