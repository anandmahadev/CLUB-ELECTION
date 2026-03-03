/**
 * Authentication Middleware
 * Verifies JWT tokens for student and admin routes
 */
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware to protect student routes
 * Validates student JWT token
 */
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.',
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach student info to request
        req.student = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Session expired. Please login again.',
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid token. Please login again.',
        });
    }
};

/**
 * Middleware to protect admin routes
 * Validates admin JWT token
 */
const adminAuthMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Admin access denied. No token provided.',
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

        // Ensure role is admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden. Admin access required.',
            });
        }

        req.admin = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Admin session expired. Please login again.',
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid admin token.',
        });
    }
};

module.exports = { authMiddleware, adminAuthMiddleware };
