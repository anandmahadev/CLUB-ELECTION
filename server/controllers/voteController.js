/**
 * Vote Controller
 * Handles fetching candidates and submitting votes
 */
const pool = require('../config/db');

/**
 * GET /api/candidates
 * Returns list of candidates (requires auth)
 * Also returns election status and whether student has voted
 */
const getCandidates = async (req, res) => {
    try {
        const studentId = req.student.id;

        // Fetch current student's vote status
        const studentResult = await pool.query(
            'SELECT has_voted FROM students WHERE id = $1',
            [studentId]
        );

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }

        const has_voted = studentResult.rows[0].has_voted;

        // Fetch election config
        const configResult = await pool.query(
            'SELECT election_active, election_name, started_at FROM election_config LIMIT 1'
        );
        const config = configResult.rows[0] || { election_active: false, election_name: 'Election' };

        // Fetch all candidates
        const candidatesResult = await pool.query(
            'SELECT id, name, photo_url, manifesto, department, year FROM candidates ORDER BY id ASC'
        );

        return res.status(200).json({
            success: true,
            election_active: config.election_active,
            election_name: config.election_name,
            started_at: config.started_at,
            has_voted,
            candidates: candidatesResult.rows,
        });
    } catch (error) {
        console.error('[Vote] getCandidates error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch candidates.',
        });
    }
};

/**
 * POST /api/vote
 * Submits a vote for a candidate
 * Uses DB transaction to ensure atomicity:
 *   1. Check election is active
 *   2. Check student hasn't voted
 *   3. Insert vote record
 *   4. Set has_voted = true on student
 */
const submitVote = async (req, res) => {
    const client = await pool.connect();

    try {
        const { candidate_id } = req.body;
        const studentId = req.student.id;

        await client.query('BEGIN');

        // 1. Check election is active
        const configResult = await client.query(
            'SELECT election_active FROM election_config LIMIT 1'
        );
        const config = configResult.rows[0];

        if (!config || !config.election_active) {
            await client.query('ROLLBACK');
            return res.status(403).json({
                success: false,
                message: 'Voting is currently closed.',
            });
        }

        // 2. Lock the student row to prevent race conditions (double-click, parallel requests)
        const studentResult = await client.query(
            'SELECT id, has_voted FROM students WHERE id = $1 FOR UPDATE',
            [studentId]
        );

        if (studentResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ success: false, message: 'Student not found.' });
        }

        if (studentResult.rows[0].has_voted) {
            await client.query('ROLLBACK');
            return res.status(409).json({
                success: false,
                message: 'You have already voted.',
                already_voted: true,
            });
        }

        // 3. Check candidate exists
        const candidateResult = await client.query(
            'SELECT id, name FROM candidates WHERE id = $1',
            [candidate_id]
        );

        if (candidateResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ success: false, message: 'Candidate not found.' });
        }

        // 4. Insert the vote (anonymous: stored but UI never reveals student→candidate mapping)
        await client.query(
            'INSERT INTO votes (student_id, candidate_id) VALUES ($1, $2)',
            [studentId, candidate_id]
        );

        // 5. Mark student as voted
        await client.query(
            'UPDATE students SET has_voted = TRUE WHERE id = $1',
            [studentId]
        );

        await client.query('COMMIT');

        return res.status(200).json({
            success: true,
            message: 'Your vote has been recorded successfully.',
        });
    } catch (error) {
        await client.query('ROLLBACK');

        // Handle unique constraint violation (race condition backup)
        if (error.code === '23505') {
            return res.status(409).json({
                success: false,
                message: 'You have already voted.',
                already_voted: true,
            });
        }

        console.error('[Vote] submitVote error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to record vote. Please try again.',
        });
    } finally {
        client.release();
    }
};

module.exports = { getCandidates, submitVote };
