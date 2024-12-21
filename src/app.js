const express = require('express');
const dotenv = require('dotenv');
const studentRoutes = require('./routes/studentRoutes');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  }));

dotenv.config();



// Set up the routes
app.use('/api', studentRoutes);

module.exports = app;
