/**
 * Student Auth Routes
 * POST /api/auth/login
 */
const express = require('express');
const router = express.Router();
const { studentLogin } = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const { loginValidation, validate } = require('../middleware/validate');

// Student login
router.post('/login', authLimiter, loginValidation, validate, studentLogin);

module.exports = router;
