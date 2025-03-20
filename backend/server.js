const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const paymentRoutes = require("./routes/paymentRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/destinations", require("./routes/destinationRoutes"));
app.use("/api/payments", paymentRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
