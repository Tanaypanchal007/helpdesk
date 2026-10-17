const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access token is required."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await userModel.findById(decoded.userId)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found."
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                message: "Your account is inactive."
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};

module.exports = authMiddleware;