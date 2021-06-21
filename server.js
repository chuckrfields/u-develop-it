const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes'); // Remember that you don't have to specify index.js in the path. If the directory has an index.js file in it, Node.js will automatically look for it when requiring the directory.

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// Use apiRoutes
app.use('/api', apiRoutes);

// test db connection
// db.query(`Select * FROM candidates`, (err, rows) => {
//     console.log(rows);
// })

// Default response for any other request (not found)
// Must be last! Or else it will overwrite others.
app.use((req, res) => {
    res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
  
// app.listen(PORT, () => {
//     console.log(`Server running on Port ${PORT}`);
// });