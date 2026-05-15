const express = require('express');
const router = express.Router();
const pool = require('../config/db');

//GET: fetch all users
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM team_users ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

//POST: create a new user
router.post('/', async (req, res) => {
    const { name, email, role, password } = req.body;
    try {
        const query = `
            INSERT INTO team_users (name, email, role, password) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *;
        `;
        const result = await pool.query(query, [name, email, role, password]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating user:", error);
        //handle duplicate email error specifically
        if (error.code === '23505') {
            return res.status(400).json({ error: "A user with this email already exists." });
        }
        res.status(500).json({ error: "Failed to create user" });
    }
});

//PUT: update an existing user
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    try {
        const query = `
            UPDATE team_users 
            SET name = $1, email = $2, role = $3, password = $4 
            WHERE id = $5 
            RETURNING *;
        `;
        const result = await pool.query(query, [name, email, role, password, id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
});

//DELETE: remove a user
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

//POST: verify login credentials
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        //database to see if a user exists with this exact email, password, and  role
        const query = 'SELECT * FROM team_users WHERE email = $1 AND password = $2 AND role = $3';
        const result = await pool.query(query, [email, password, role]);

        if (result.rows.length === 1) {
            //match found, send back success.
            res.status(200).json(result.rows[0]);
        } else {
            //no match found
            res.status(401).json({ error: "Invalid credentials. Please check your email and password." });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error during login process" });
    }
});

module.exports = router;