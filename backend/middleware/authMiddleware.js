const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // ✅ Fix: Ensure `req.user.id` exists
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Invalid token: No user ID found." });
        }

        req.user.id = req.user.userId; // ✅ Ensure `id` is assigned correctly

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};
