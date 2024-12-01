const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const ResearchPaper = require('../models/ResearchPaper');

const router = express.Router();

// Submit a Research Paper (Student & Faculty Only)
router.post('/submit', authenticate, authorize(['student', 'faculty']), async (req, res) => {
  try {
    const researchPaper = new ResearchPaper({ ...req.body, submittedBy: req.user.id });
    await researchPaper.save();
    res.status(201).send({ message: 'Research paper submitted successfully.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get All Research Papers (Committee & Dean Only)
router.get('/', authenticate, authorize(['committee', 'dean']), async (req, res) => {
  try {
    const papers = await ResearchPaper.find();
    res.status(200).send(papers);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Approve Research Paper (Committee Only)
router.put('/:id/approve', authenticate, authorize(['committee']), async (req, res) => {
  try {
    const paper = await ResearchPaper.findById(req.params.id);
    if (!paper) return res.status(404).send({ error: 'Research paper not found.' });

    paper.status = 'approved';
    await paper.save();
    res.status(200).send({ message: 'Research paper approved.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
