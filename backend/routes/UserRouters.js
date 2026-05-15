const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// GET: fetch all users
router.get('/', async (req, res) => {
    try {
        // Optimization: We don't fetch the password field at all for the list view
        const result = await pool.query('SELECT id, name, email, role, created_at FROM team_users ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// POST: create a new user (With Hashing)
router.post('/', async (req, res) => {
    const { name, email, role, password } = req.body;
    try {
        // 1. Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `
            INSERT INTO team_users (name, email, role, password) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, name, email, role;
        `;
        const result = await pool.query(query, [name, email, role, hashedPassword]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating user:", error);
        if (error.code === '23505') {
            return res.status(400).json({ error: "A user with this email already exists." });
        }
        res.status(500).json({ error: "Failed to create user" });
    }
});

// PUT: update an existing user (With Hashing)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    try {
        // 1. Hash the new password before updating
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `
            UPDATE team_users 
            SET name = $1, email = $2, role = $3, password = $4 
            WHERE id = $5 
            RETURNING id, name, email, role;
        `;
        const result = await pool.query(query, [name, email, role, hashedPassword, id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
});

// DELETE: remove a user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM team_users WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// POST: verify login credentials (Secure Comparison)
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        // 1. Search for the user by email and role only
        const query = 'SELECT * FROM team_users WHERE email = $1 AND role = $2';
        const result = await pool.query(query, [email, role]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const user = result.rows[0];

        // 2. Compare the plain-text password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Success! Remove password from user object before sending to frontend
            delete user.password;
            res.status(200).json(user);
        } else {
            // Password did not match
            res.status(401).json({ error: "Invalid credentials." });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error during login process" });
    }
});

module.exports = router;