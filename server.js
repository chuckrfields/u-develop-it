const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

// Express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL Username
        user: 'spacetech',
        // MySQL password
        password: 'SpaceTech21!',
        database: 'election'
    },
    console.log("Connected to the election database")
);

// test db connection
// db.query(`Select * FROM candidates`, (err, rows) => {
//     console.log(rows);
// })

// GET all candidates
app.get('/api/candidates', (req, res) => {
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
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
    AS party_name 
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id
    WHERE ID = ?`;
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
app.delete('/api/candidate/:id', (req, res) => {
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
app.post('/api/candidate', ( { body }, res) => { // Notice that we're using object destructuring to pull the body property out of the request object (req.body)
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
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//                 VALUES (?, ?, ?, ?)`;
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// Test Route
// app.get('/', (req, res) =>{
//     res.json( {
//         message: "Hello World"
//     });
// });

// Default response for any other request (not found)
// Must be last! Or else it will overwrite others.
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});