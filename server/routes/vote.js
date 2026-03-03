/**
 * Voting Routes
 * All routes require student JWT authentication
 */
const express = require('express');
const router = express.Router();
const { getCandidates, submitVote } = require('../controllers/voteController');
const { authMiddleware } = require('../middleware/auth');
const { voteLimiter } = require('../middleware/rateLimiter');
const { voteValidation, validate } = require('../middleware/validate');

// Get candidates + election status (requires login)
router.get('/candidates', authMiddleware, getCandidates);

// Submit a vote (requires login + rate limiting + validation)
router.post('/vote', authMiddleware, voteLimiter, voteValidation, validate, submitVote);

module.exports = router;
