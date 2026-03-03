/**
 * Rate Limiting Middleware
 * Protects endpoints from brute force and abuse
 */
const rateLimit = require('express-rate-limit');

/**
 * Strict limiter for authentication endpoints
 * Prevents brute-force login attacks
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes.',
    },
    skipSuccessfulRequests: true, // Don't count successful logins
});

/**
 * General API limiter
 * Prevents API abuse
 */
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests. Please slow down.',
    },
});

/**
 * Strict vote limiter
 * One vote attempt per student per window
 */
const voteLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many vote attempts. Please wait before trying again.',
    },
});

module.exports = { authLimiter, apiLimiter, voteLimiter };
