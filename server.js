const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');

// Express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL Username
        user: 'root',
        // MySQL password
        password: 'IgUa6406Ma!',
        database: 'election'
    },
    console.log("Connected to the election database")
);

// test db connection
db.query(`Select * FROM candidates`, (err, rows) => {
    console.log(rows);
})

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