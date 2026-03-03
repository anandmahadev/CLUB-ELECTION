/**
 * College Election System - Express Server
 * Entry point for the backend API
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Route imports
const authRoutes = require('./routes/auth');
const voteRoutes = require('./routes/vote');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// =============================================
// CORS Configuration
// =============================================
const corsOptions = {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

// =============================================
// Body Parsers
// =============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =============================================
// Security Headers
// =============================================
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// =============================================
// Health Check
// =============================================
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'College Election API is running.',
        timestamp: new Date().toISOString(),
    });
});

// =============================================
// API Routes
// =============================================
app.use('/api/auth', authRoutes);
app.use('/api', voteRoutes);
app.use('/api/admin', adminRoutes);

// =============================================
// 404 Handler
// =============================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// =============================================
// Global Error Handler
// =============================================
app.use((err, req, res, next) => {
    console.error('[Server] Unhandled error:', err.message);

    // Multer file size error
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Max 5MB.' });
    }

    // Multer file type error
    if (err.message === 'Only CSV files are allowed.') {
        return res.status(400).json({ success: false, message: err.message });
    }

    return res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message,
    });
});

// =============================================
// Start Server
// =============================================
app.listen(PORT, () => {
    console.log(`[Server] College Election API running on port ${PORT}`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
});
