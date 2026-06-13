const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); // 1. Import the database configuration

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Invoke the Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/api/message', (req, res) => {
    res.json({ text: 'Hello from the modular MERN Backend!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});