const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

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