/**
 * Admin Controller
 * All administrative operations:
 * - Admin login
 * - Candidate management
 * - Student bulk upload
 * - Election control
 * - Results export
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const csv = require('csv-parser');
const { Readable } = require('stream');
const pool = require('../config/db');
require('dotenv').config();

// =============================================
// ADMIN LOGIN
// =============================================

/**
 * POST /api/admin/login
 * Admin login with username + password
 */
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await pool.query(
            'SELECT id, username, password_hash FROM admins WHERE username = $1',
            [username.trim()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials.',
            });
        }

        const admin = result.rows[0];
        const isMatch = await bcrypt.compare(password, admin.password_hash);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials.',
            });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username, role: 'admin' },
            process.env.JWT_ADMIN_SECRET,
            { expiresIn: process.env.JWT_EXPIRY || '1h' }
        );

        return res.status(200).json({
            success: true,
            message: 'Admin login successful.',
            token,
            admin: { id: admin.id, username: admin.username },
        });
    } catch (error) {
        console.error('[Admin] adminLogin error:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// =============================================
// CANDIDATE MANAGEMENT
// =============================================

/**
 * POST /api/admin/add-candidate
 * Adds a new candidate
 */
const addCandidate = async (req, res) => {
    try {
        const { name, manifesto, department, year, photo_url } = req.body;

        const result = await pool.query(
            `INSERT INTO candidates (name, photo_url, manifesto, department, year)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, photo_url, manifesto, department, year`,
            [name, photo_url || null, manifesto || null, department || null, year || null]
        );

        return res.status(201).json({
            success: true,
            message: 'Candidate added successfully.',
            candidate: result.rows[0],
        });
    } catch (error) {
        console.error('[Admin] addCandidate error:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to add candidate.' });
    }
};

/**
 * GET /api/admin/candidates
 * Lists all candidates
 */
const getCandidates = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, photo_url, manifesto, department, year, created_at FROM candidates ORDER BY id ASC'
        );
        return res.status(200).json({ success: true, candidates: result.rows });
    } catch (error) {
        console.error('[Admin] getCandidates error:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to fetch candidates.' });
    }
};

/**
 * DELETE /api/admin/candidates/:id
 * Removes a candidate
 */
const deleteCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM candidates WHERE id = $1', [id]);
        return res.status(200).json({ success: true, message: 'Candidate removed.' });
    } catch (error) {
        console.error('[Admin] deleteCandidate error:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to delete candidate.' });
    }
};

// =============================================
// STUDENT MANAGEMENT
// =============================================

/**
 * POST /api/admin/upload-students
 * Bulk upload students via CSV
 * Expected CSV columns: name, roll_number, department, year, password
 */
const uploadStudents = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No CSV file uploaded.' });
        }

        const students = [];
        const errors = [];
        const SALT_ROUNDS = 10;

        // Parse CSV from uploaded buffer
        await new Promise((resolve, reject) => {
            const stream = Readable.from(req.file.buffer.toString());
            stream
                .pipe(csv())
                .on('data', (row) => {
                    if (!row.name || !row.roll_number || !row.password) {
                        errors.push(`Row has missing required fields: ${JSON.stringify(row)}`);
                    } else {
                        students.push(row);
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });

        if (students.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid student rows found in CSV.',
                errors,
            });
        }

        // Hash passwords and insert into DB
        let inserted = 0;
        let skipped = 0;
        const insertErrors = [];

        for (const student of students) {
            try {
                const hash = await bcrypt.hash(student.password.trim(), SALT_ROUNDS);
                await pool.query(
                    `INSERT INTO students (name, roll_number, department, year, password_hash)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (roll_number) DO NOTHING`,
                    [
                        student.name.trim(),
                        student.roll_number.trim(),
                        student.department ? student.department.trim() : null,
                        student.year ? student.year.trim() : null,
                        hash,
                    ]
                );
                inserted++;
            } catch (err) {
                skipped++;
                insertErrors.push(`${student.roll_number}: ${err.message}`);
            }
        }

        return res.status(200).json({
            success: true,
            message: `Upload complete. ${inserted} students added, ${skipped} skipped.`,
            inserted,
            skipped,
            errors: [...errors, ...insertErrors],
        });
    } catch (error) {
        console.error('[Admin] uploadStudents error:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to process CSV file.' });
    }
};

/**
 * GET /api/admin/students
 * Lists all students with vote status
 */
const getStudents = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, roll_number, department, year, has_voted, created_at FROM students ORDER BY created_at DESC'
        );
        return res.status(200).json({ success: true, students: result.rows });
    } catch (error) {
        console.error('[Admin] getStudents error:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to fetch students.' });
    }
};

// =============================================
// ELECTION CONTROL
// =============================================

/**
 * POST /api/admin/start-election
 * Activates the election
 */
const startElection = async (req, res) => {
    try {
        // Check there's at least one candidate before starting
        const candResult = await pool.query('SELECT COUNT(*) FROM candidates');
        if (parseInt(candResult.rows[0].count) === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot start election: no candidates added.',
            });
        }

        await pool.query(
            `UPDATE election_config SET election_active = TRUE, started_at = NOW(), ended_at = NULL, updated_at = NOW()`
        );

        return res.status(200).json({
            success: true,
            message: 'Election started successfully.',
        });
    } catch (error) {
        console.error('[Admin] startElection error:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to start election.' });
    }
};

/**
 * POST /api/admin/stop-election
 * Deactivates the election
 */
const stopElection = async (req, res) => {
    try {
        await pool.query(
            `UPDATE election_config SET election_active = FALSE, ended_at = NOW(), updated_at = NOW()`
        );

        return res.status(200).json({
            success: true,
            message: 'Election stopped successfully.',
        });
    } catch (error) {
        console.error('[Admin] stopElection error:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to stop election.' });
    }
};

// =============================================
// RESULTS
// =============================================

/**
 * GET /api/admin/results
 * Returns aggregated vote counts per candidate
 * NOTE: Does NOT reveal which student voted for whom
 */
const getResults = async (req, res) => {
    try {
        // Aggregated results only
        const votesResult = await pool.query(`
      SELECT
        c.id,
        c.name,
        c.department,
        c.year,
        c.photo_url,
        COUNT(v.id)::int AS vote_count
      FROM candidates c
      LEFT JOIN votes v ON c.id = v.candidate_id
      GROUP BY c.id, c.name, c.department, c.year, c.photo_url
      ORDER BY vote_count DESC, c.id ASC
    `);

        const statsResult = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM students)::int AS total_students,
        (SELECT COUNT(*) FROM students WHERE has_voted = TRUE)::int AS total_voted,
        (SELECT COUNT(*) FROM votes)::int AS total_votes
    `);

        const configResult = await pool.query(
            'SELECT election_active, election_name, started_at, ended_at FROM election_config LIMIT 1'
        );

        return res.status(200).json({
            success: true,
            results: votesResult.rows,
            stats: statsResult.rows[0],
            config: configResult.rows[0],
        });
    } catch (error) {
        console.error('[Admin] getResults error:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to fetch results.' });
    }
};

/**
 * GET /api/admin/export-results
 * Returns results as CSV download
 */
const exportResults = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT
        c.name AS "Candidate Name",
        c.department AS "Department",
        c.year AS "Year",
        COUNT(v.id)::int AS "Votes Received"
      FROM candidates c
      LEFT JOIN votes v ON c.id = v.candidate_id
      GROUP BY c.id, c.name, c.department, c.year
      ORDER BY COUNT(v.id) DESC
    `);

        const statsResult = await pool.query(`
      SELECT COUNT(*)::int AS total FROM students WHERE has_voted = TRUE
    `);

        const rows = result.rows;
        const header = Object.keys(rows[0] || { 'Candidate Name': '', Department: '', Year: '', 'Votes Received': '' }).join(',');
        const csvRows = rows.map((r) => Object.values(r).join(','));
        const csvContent = [header, ...csvRows, '', `Total Votes Cast,${statsResult.rows[0].total}`].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="election_results.csv"');
        return res.status(200).send(csvContent);
    } catch (error) {
        console.error('[Admin] exportResults error:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to export results.' });
    }
};

/**
 * GET /api/admin/dashboard
 * Dashboard summary for admin panel
 */
const getDashboard = async (req, res) => {
    try {
        const statsResult = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM students)::int AS total_students,
        (SELECT COUNT(*) FROM students WHERE has_voted = TRUE)::int AS total_voted,
        (SELECT COUNT(*) FROM candidates)::int AS total_candidates,
        (SELECT COUNT(*) FROM votes)::int AS total_votes
    `);

        const configResult = await pool.query(
            'SELECT election_active, election_name, started_at, ended_at FROM election_config LIMIT 1'
        );

        return res.status(200).json({
            success: true,
            stats: statsResult.rows[0],
            config: configResult.rows[0],
        });
    } catch (error) {
        console.error('[Admin] getDashboard error:', error.message);
        return res.status(500).json({ success: false, message: 'Failed to fetch dashboard data.' });
    }
};

module.exports = {
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
};
