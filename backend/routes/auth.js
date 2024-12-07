const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
// Register User
router.post('/register', async (req, res) => {
  try {
    const { email, name, password, userType, employeeId, department, mobileNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send({ error: 'Email already in use.' });

    const user = new User({ email, name, password, userType, employeeId, department, mobileNumber });
    await user.save();

    res.status(201).send({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

const JWT_SECRET = 'sdgzgdzsfdjhgzjufygjuzasyfgjuzsyjfgsjzymgjfzmjayushkillesyoumany';
// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: 'User not found.' });
    if (user.password !== password) return res.status(401).send({ error: 'Invalid password.' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email, userType: user.userType, name: user.name, department: user.department, mobileNumber: user.mobileNumber, employeeId: user.employeeId}, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).send({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = { router};

