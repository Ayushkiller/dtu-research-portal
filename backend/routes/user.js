const express = require('express');
const router = express.Router();
const { authorizeUser } = require('../middlewares/authMiddleware');
const User = require('../models/User');

// Route to fetch the authenticated user's details
router.get('/me', authorizeUser, async (req, res) => {
    try {
        const userId = req.userId; // Directly access req.userId
        if (!userId) {
            return res.status(400).json({ error: 'User ID not provided' });
        }

        const user = await User.findById(userId).select('-password'); // Exclude password for security
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user details' });
    }
});

module.exports = router;
