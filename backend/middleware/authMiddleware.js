// authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Ensure the path to your User model is correct

const authenticateJWT = (req, res, next) => {
    console.log('middle');
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (authHeader) {
        const token = authHeader.split(' ')[1];  // Expecting "Bearer <token>"
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Token is invalid or expired", error: err.message });
            }
            console.log(token);
            try {
                const user = await User.findById(decoded.userId);
                console.log(decoded);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }

                // Attach user ID to request object
                req.user = { id: user._id, role: user.role };
                next();
            } catch (error) {
                res.status(500).json({ message: "Internal server error during authentication", error: error.message });
            }
        });
    } else {
        res.status(401).json({ message: "Authorization header not found" });
    }
};

module.exports = {authenticateJWT};