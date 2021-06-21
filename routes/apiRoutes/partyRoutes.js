const { Router } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// GET all parties
router.get('/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json( { error: message }); // 500 indicates server error
            return;
        } 
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// GET party by id
router.get('/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE ID = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json( { error: err.message });  // 400 indicates user error
            return;
        } 
        res.json({
            message: 'success',
            data: row
        });
    });
});

// DELETE party by id
router.delete('/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE ID = ?`;
    const params= [req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json( { error: res.message });
            // checks if anything was deleted
        } else if (!result.affectedRows) {
            res.json( {
                message: 'Party not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

module.exports = router;