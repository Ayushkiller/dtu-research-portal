const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = '66fe37c54c0ada2c0e95d6227c5555a9525f0fcb489c833cb4ab7fff47f4cfa4';

// Register User
router.post('/register', async (req, res) => {
  try {
    console.log('Incoming request data:', req.body); // Log incoming request data

    const { email, name, password, role, department, biography } = req.body;

    // Ensure email is unique
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send({ error: 'Email already in use.' });

    const user = new User({ email, name, password, role, department, biography });
    await user.save();

    res.status(201).send({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: 'User not found.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).send({ error: 'Invalid password.' });

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Middleware to Protect Routes
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send({ error: 'No token provided.' });

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    res.status(401).send({ error: 'Invalid token.' });
  }
};

module.exports = { router, authenticate };
