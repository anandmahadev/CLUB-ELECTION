/**
 * Input Validation Middleware
 * Uses express-validator to sanitize and validate all inputs
 */
const { body, validationResult } = require('express-validator');

/**
 * Validates the result of express-validator checks
 * Returns 400 with field errors if validation fails
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed.',
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
    }
    next();
};

// Validation rules for student login
const loginValidation = [
    body('roll_number')
        .trim()
        .notEmpty().withMessage('Roll number is required.')
        .isLength({ min: 1, max: 50 }).withMessage('Invalid roll number format.')
        .escape(),
    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 4, max: 100 }).withMessage('Password must be 4-100 characters.'),
];

// Validation rules for admin login
const adminLoginValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required.')
        .isLength({ min: 1, max: 50 }).withMessage('Username too long.')
        .escape(),
    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 4, max: 100 }).withMessage('Password must be 4-100 characters.'),
];

// Validation rules for submitting a vote
const voteValidation = [
    body('candidate_id')
        .notEmpty().withMessage('Candidate ID is required.')
        .isInt({ min: 1 }).withMessage('Invalid candidate ID.'),
];

// Validation rules for adding a candidate
const addCandidateValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Candidate name is required.')
        .isLength({ min: 2, max: 255 }).withMessage('Name must be 2-255 characters.')
        .escape(),
    body('manifesto')
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage('Manifesto too long (max 2000 chars).')
        .escape(),
    body('department')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Department name too long.')
        .escape(),
    body('year')
        .optional()
        .trim()
        .isLength({ max: 10 }).withMessage('Year value too long.')
        .escape(),
];

module.exports = {
    validate,
    loginValidation,
    adminLoginValidation,
    voteValidation,
    addCandidateValidation,
};
