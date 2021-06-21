const mysql = require('mysql2');

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

module.exports = db;