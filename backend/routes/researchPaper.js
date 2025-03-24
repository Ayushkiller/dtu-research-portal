const express = require('express');
const router = express.Router();
const ResearchPaper = require('../models/ResearchPaper');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: './uploads/photographs/',
  filename: function(req, file, cb) {
    cb(null, 'PHOTO-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('photograph');

// Check File Type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

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
  

  
  
router.post('/save-draft', upload, async (req, res) => {
    try {
      const formData = { ...req.body };
  
      // Parse the authors string back to an array
      if (typeof formData.authors === 'string') {
        formData.authors = JSON.parse(formData.authors);
      }
  
      // Add photograph path if file was uploaded
      if (req.file) {
        formData.photograph = `/uploads/photographs/${req.file.filename}`;
      }
  
      formData.status = 'draft';
  
      const researchPaper = new ResearchPaper(formData);
      await researchPaper.save();
      console.log('Draft saved:', researchPaperId);
      res.status(201).json({
        success: true,
        message: 'Draft saved successfully',
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      res.status(500).json({
        success: false,
        message: 'Error saving draft',
        error: error.message
      });
    }
  });
  
module.exports = router;
