const express = require('express');
const dotenv = require('dotenv');
const studentRoutes = require('./routes/studentRoutes');

dotenv.config();

const app = express();
app.use(express.json());

// Set up the routes
app.use('/api', studentRoutes);

module.exports = app;
