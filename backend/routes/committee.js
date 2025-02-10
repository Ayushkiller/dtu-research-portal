const express = require('express');
const router = express.Router();
const {  authorizeCommitteeMember } = require('../middlewares/authMiddleware'); // Middleware to check if user is a Dean
const User = require('../models/User');
const ResearchPaper = require('../models/ResearchPaper');
const { default: mongoose } = require("mongoose");

router.get('/accounts', authorizeCommitteeMember, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user accounts' });
    }
});


router.get('/research-papers', authorizeCommitteeMember, async (req, res) => {
    try {
      const researchPapers = await ResearchPaper.find({
        status: { $ne: 'authorshipConfirmationPending' }
      });
      res.status(200).json(researchPapers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch research papers' });
    }
  });


  router.put('/research-papers/:paperId/status', authorizeCommitteeMember, async (req, res) => {
    const { paperId } = req.params;
    const { status, comments } = req.body; // status can be 'approved' or 'rejected'
    console.log(status);
    try {
      const paper = await ResearchPaper.findById(paperId);
      if (!paper) return res.status(404).json({ error: 'Research paper not found' });
      console.log(paper);
      
      paper.status = status; // Add a `status` field in the ResearchPaper schema
      if(status === 'approved'){
        paper.approvedBy = req.user.id;
        paper.status = 'approved';
      }else if(status === 'suspended'){
        paper.suspendedBy = req.user.id;
        paper.status = 'suspended';
      }
      else if(status === 'underReview'){
        paper.reviewedBy = req.user.id;
        paper.status = 'underReview';
      }
      else if(status === 'rejected'){
        paper.rejectedBy = req.user.id;
        paper.status = 'rejected';
      }

      


      // paper.comments = comments || null; // Add a `comments` field in the schema if needed
      await paper.save();
  
      res.status(200).json({ message: `Research paper ${status}` });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update research paper status' });
    }
  });

module.exports = router;