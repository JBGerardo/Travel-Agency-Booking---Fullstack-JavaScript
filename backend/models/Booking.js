const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination",
    required: true,
  },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  tripType: { type: String, enum: ["oneway", "roundtrip"], default: "oneway" },
  includeHotel: { type: Boolean, default: false },
  numPeople: { type: Number, default: 1 },
  calculatedPrice: { type: Number },
});

module.exports = mongoose.model("Booking", BookingSchema);
