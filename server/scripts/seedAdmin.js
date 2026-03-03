/**
 * Admin Seeder Script
 * Creates the admin user in the database
 * Run ONCE after setting up the database: node scripts/seedAdmin.js
 */
require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function seedAdmin() {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123';

    try {
        console.log('[Seeder] Connecting to database...');
        const hash = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO admins (username, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
            [username, hash]
        );

        console.log(`[Seeder] Admin user "${username}" created/updated successfully.`);
        console.log(`[Seeder] Login at: /admin`);
        console.log(`[Seeder] Username: ${username}`);
        console.log(`[Seeder] Password: ${password}`);
    } catch (error) {
        console.error('[Seeder] Error:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

seedAdmin();
