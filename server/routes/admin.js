/**
 * Admin Routes
 * All management routes protected by admin JWT middleware
 */
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { adminAuthMiddleware } = require('../middleware/auth');
const { authLimiter, apiLimiter } = require('../middleware/rateLimiter');
const {
    adminLoginValidation,
    addCandidateValidation,
    validate,
} = require('../middleware/validate');
const {
    adminLogin,
    addCandidate,
    getCandidates,
    deleteCandidate,
    uploadStudents,
    getStudents,
    startElection,
    stopElection,
    getResults,
    exportResults,
    getDashboard,
} = require('../controllers/adminController');

// Multer: in-memory storage for CSV uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed.'), false);
        }
    },
});

// ---- Public admin route (login) ----
router.post('/login', authLimiter, adminLoginValidation, validate, adminLogin);

// ---- Protected admin routes ----
router.use(adminAuthMiddleware); // All routes below require admin JWT

// Dashboard
router.get('/dashboard', apiLimiter, getDashboard);

// Candidates
router.post('/add-candidate', apiLimiter, addCandidateValidation, validate, addCandidate);
router.get('/candidates', apiLimiter, getCandidates);
router.delete('/candidates/:id', apiLimiter, deleteCandidate);

// Students
router.post('/upload-students', apiLimiter, upload.single('file'), uploadStudents);
router.get('/students', apiLimiter, getStudents);

// Election control
router.post('/start-election', apiLimiter, startElection);
router.post('/stop-election', apiLimiter, stopElection);

// Results
router.get('/results', apiLimiter, getResults);
router.get('/export-results', exportResults); // No rate limit for file download

module.exports = router;
