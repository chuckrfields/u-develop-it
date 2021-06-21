const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// GET all candidates
router.get('/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name AS party_name
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json( { error: err.message }); //The 500 status code indicates a server error
            return;
        }
        res.json( {
            message: 'success',
            data: rows
        });
    });
});

// GET a single candidate
router.get('/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
    AS party_name 
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id
    WHERE candidates.ID = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json( { error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// DELETE a candidate
router.delete('/candidate/:id', (req, res) => {
// Use ? for 'prepared statement' followed by the param argument (can be array)
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json( { error: res.message });
        } else if (!result.affectedRows) { // result.affectedRows will verify whether any rows were changed.
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
} );

// CREATE a candidate with POST
router.post('/candidate', ( { body }, res) => { // Notice that we're using object destructuring to pull the body property out of the request object (req.body)
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected'); // The imported inputCheck module verifies that user info in the request can create a candidate.
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
                    VALUES (?, ?, ?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

// UPDATE a candidate with PUT
router.put('/candidate/:id', (req, res) => {
    //Validate
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
        res.status(400).json( { error: errors });
        return;
    }

    const sql = `UPDATE candidates SET party_id = ?
    WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json( { error: err.message });
            // Check if record found
        } else if (!result.affectedRows) {
            res.json( {
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

module.exports = router;