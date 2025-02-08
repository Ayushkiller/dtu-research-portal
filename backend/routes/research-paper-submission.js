const express = require('express');
const router = express.Router();
const ResearchPaper = require('../models/ResearchPaper');

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const submissions = await ResearchPaper.find({ 
      $or: [
        { 'email': userId },
        { 'applicantEmail': userId },
        { 'authors.email': userId }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error: error.message });
  }
});

module.exports = router;
