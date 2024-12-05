const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
    try {
      const { email, name, password, userType, employeeId, department, mobileNumber } = req.body;
  
      // Ensure email is unique
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).send({ error: 'Email already in use.' });
  
      const user = new User({ email, name, password, userType, employeeId, department, mobileNumber });
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

    if (user.password !== password) return res.status(401).send({ error: 'Invalid password.' });

    res.status(200).send({ message: 'Login successful', user: { id: user._id, userType: user.userType } });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
  
  // Middleware to Protect Routes
  const authenticate = async (req, res, next) => {
   
    const userId = req.header('User-Id');
    if (!userId) return res.status(401).send({ error: 'No user ID provided.' });
  
    try {

      const user = await User.findById(userId);
      if (!user) return res.status(404).send({ error: 'User not found.' });
  
      req.user = user; 
      next();
    } catch (error) {
      res.status(401).send({ error: 'Invalid user ID.' });
    }
  };
  
  module.exports = { router, authenticate };

module.exports = { router, authenticate };