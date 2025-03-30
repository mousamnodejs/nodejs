import jwt from "jsonwebtoken";
import apiResponse from "../helper/apiResponse.js";

const authMiddleware = (req, res, next) => {
    try {
        // Get the token from Authorization header
        const token = req.header("Authorization");
        if (!token) return apiResponse.unauthorized(res, "Access denied. No token provided.");

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // Attach user data (id, role) to request object
        req.role= decoded.role

        next(); // Proceed to next middleware/controller
    } catch (error) {
        return apiResponse.unauthorized(res, "Invalid or expired token.");
    }
};

export default authMiddleware;
