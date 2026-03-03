/**
 * Auth Controller
 * Handles student login and JWT issuance
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

/**
 * POST /api/auth/login
 * Student login with roll_number + password
 */
const studentLogin = async (req, res) => {
    try {
        const { roll_number, password } = req.body;

        // Look up student by roll number
        const result = await pool.query(
            'SELECT id, name, roll_number, department, year, password_hash, has_voted FROM students WHERE roll_number = $1',
            [roll_number.trim()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid roll number or password.',
            });
        }

        const student = result.rows[0];

        // Compare password with stored hash
        const isMatch = await bcrypt.compare(password, student.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid roll number or password.',
            });
        }

        // Issue JWT token
        const payload = {
            id: student.id,
            roll_number: student.roll_number,
            name: student.name,
            department: student.department,
            year: student.year,
            role: 'student',
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY || '1h',
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            token,
            student: {
                id: student.id,
                name: student.name,
                roll_number: student.roll_number,
                department: student.department,
                year: student.year,
                has_voted: student.has_voted,
            },
        });
    } catch (error) {
        console.error('[Auth] studentLogin error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again.',
        });
    }
};

module.exports = { studentLogin };
