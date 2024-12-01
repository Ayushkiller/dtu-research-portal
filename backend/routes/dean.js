const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');
const ResearchPaper = require('../models/ResearchPaper');
const FormQuestion = require('../models/FormQuestion');
const router = express.Router();

// Ensure Dean authorization
router.use(authenticate);
router.use(authorize(['dean']));

// Modify Form Questions
router.put('/modify-question/:id', async (req, res) => {
  try {
    const updatedQuestion = await FormQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// View All Research Papers
router.get('/research-papers', async (req, res) => {
  try {
    const papers = await ResearchPaper.find().populate('submittedBy', 'name email');
    res.status(200).json(papers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Review Research Paper (Approve, Reject, Comment)
router.put('/review-paper/:id', async (req, res) => {
  const { status, remarks } = req.body;
  try {
    const paper = await ResearchPaper.findByIdAndUpdate(req.params.id, { status, remarks }, { new: true });
    res.status(200).json(paper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ban/Remove Committee Member
router.put('/ban-remove-user/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
