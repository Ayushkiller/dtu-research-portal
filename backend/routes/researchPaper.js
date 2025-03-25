const express = require('express');
const router = express.Router();
const ResearchPaper = require('../models/ResearchPaper');

router.post('/', async (req, res) => {
    try {
      const formData = {...req.body};
      
      // Parse the authors string back to an array
      if (typeof formData.authors === 'string') {
        formData.authors = JSON.parse(formData.authors);
      }
      console.log(formData);
      
   
  
      const researchPaper = new ResearchPaper(formData);
      await researchPaper.save();
  
      res.status(201).json({
        success: true,
        message: 'Research paper submitted successfully',
        data: researchPaper,

      });
    } catch (error) {
      console.error('Error submitting research paper:', error);
      res.status(500).json({
        success: false,
        message: 'Error submitting research paper',
        error: error.message
      });
    }
  });
  router.get('/:status/:userId', async (req, res) => {
    const { status, userId } = req.params;
  
    try {
      const researchPapers = await ResearchPaper.find({
        status,
        $or: [
          { approvedBy: userId },
          { suspendedBy: userId },
          { reviewedBy: userId },
          { rejectedBy: userId }
        ]
      });
  
      res.status(200).json(researchPapers);
    } catch (error) {
      console.error('Error fetching research papers:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching research papers',
        error: error.message
      });
    }
  });

  
module.exports = router;
