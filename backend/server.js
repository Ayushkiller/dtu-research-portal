const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const authRouter = require('./routes/auth').router; // Import the auth router correctly

const app = express();

// Use morgan to log incoming requests
app.use(morgan('combined'));

// Custom middleware to log outgoing responses
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    console.log(`Outgoing response: ${body}`);
    originalSend.call(this, body);
  };
  next();
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/research-portal', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRouter); // Use the auth router

// Test Route
app.get('/', (req, res) => {
  res.send('DTU Research Portal Backend Running');
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));