const FormQuestion = require("../models/FormQuestion"); // Assuming the model is in the models folder
const express = require('express');
const router = express.Router();
const { authorizeDean } = require('../middlewares/authMiddleware'); // Middleware to check if user is a Dean
const User = require('../models/User');
const ResearchPaper = require('../models/ResearchPaper');
const { default: mongoose } = require("mongoose");


// Route to fetch all user accounts
router.get('/accounts', authorizeDean, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user accounts' });
    }
});

// Route to ban or remove an account
router.put('/accounts/ban/:userId', authorizeDean, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Soft delete: deactivate account
    user.isBanned = true; // Add an `isBanned` field in the User schema if not already present
    await user.save();

    res.status(200).json({ message: `User ${user.name} banned successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to ban user' });
  }
});

// Route to unban a user account
router.put('/accounts/unban/:userId', authorizeDean, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.isBanned = false; // Reactivate account
    await user.save();

    res.status(200).json({ message: `User ${user.name} unbanned successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unban user' });
  }
});

// Route to delegate powers to committee members
router.put('/delegate-powers/:userId', authorizeDean, async (req, res) => {
  const { userId } = req.params;
  const { delegatedPowers } = req.body; // List of delegated powers

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.userType !== 'committeeMember') {
      return res.status(400).json({ error: 'User is not a committee member' });
    }

    user.powers = delegatedPowers; // Add a `delegatedPowers` field in the User schema
    await user.save();

    res.status(200).json({ message: `Powers delegated to ${user.name}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delegate powers' });
  }
});


// Route to review research papers
router.get('/research-papers', authorizeDean, async (req, res) => {
  try {
    const researchPapers = await ResearchPaper.find();
    res.status(200).json(researchPapers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch research papers' });
  }
});

// Route to approve or reject a research paper
router.put('/research-papers/:paperId/status', authorizeDean, async (req, res) => {
  const { paperId } = req.params;
  const { status, comments } = req.body; // status can be 'approved' or 'rejected'

  try {
    const paper = await ResearchPaper.findById(paperId);
    if (!paper) return res.status(404).json({ error: 'Research paper not found' });
    
    paper.status = status; // Add a `status` field in the ResearchPaper schema
    paper.comments = comments || null; // Add a `comments` field in the schema if needed
    await paper.save();

    res.status(200).json({ message: `Research paper ${status}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update research paper status' });
  }
});





/**
 * @route   POST /questions
 * @desc    Add a new question to the database
 * @access  Public
 */
//
//get all questions
router.get("/question", async (req, res) => {
  try {
    const questions = await FormQuestion.find();
    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/question", async (req, res) => {
  try {
    const { questionText, questionType = "text", options = [], isRequired = false } = req.body;

    // Validate required fields
    if (!questionText) {
      return res.status(400).json({ error: "Question text is required" });
    }

    // Create a new question
    const newQuestion = new FormQuestion({
      questionText,
      questionType,
      options,
      isRequired,
    });

    await newQuestion.save();
    res.status(201).json({ message: "Question added successfully", question: newQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @route   DELETE /questions/:id
 * @desc    Remove a question by ID
 * @access  Public
 */
router.delete("/question/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid question ID" });
    }

    // Delete the question
    const deletedQuestion = await FormQuestion.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json({ message: "Question removed successfully", question: deletedQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/question/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { questionText, questionType = "text", options = [], isRequired = false } = req.body;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid question ID" });
    }

    // Update the question
    const updatedQuestion = await FormQuestion.findByIdAndUpdate(
      id,
      { questionText, questionType, options, isRequired },
      { new: true }
    );



    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json({ message: "Question updated successfully", question: updatedQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;


