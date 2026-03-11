const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDB } = require('./db');
const { categorizeProduct, getLogs } = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
initDB();

// Routes
app.post('/api/categorize', categorizeProduct);
app.get('/api/logs', getLogs);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
