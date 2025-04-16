const express = require("express");
const router = express.Router();
const { authorizeDean } = require("../middlewares/authMiddleware"); // Middleware to check if user is a Dean
const User = require("../models/User");
const ResearchPaper = require("../models/ResearchPaper");

// Route to fetch all user accounts
router.get("/accounts", authorizeDean, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user accounts" });
  }
});

// PUT /dean/accounts/rules/:id - Update committee member rules
router.put('/accounts/rules/:id',  authorizeDean, async (req, res) => {
  try {
    const userId = req.params.id;
    const { rules } = req.body;
    
    // Validate input
    if (!Array.isArray(rules)) {
      return res.status(400).json({ message: 'Rules must be an array' });
    }
    
    // Valid rules list for validation
    const validRules = [
      'canReviewPaper', 
      'canRejectPaper', 
      'canApprovePaper',
      'canSuspendPaper',

    ];
    
    // Validate each rule
    for (const rule of rules) {
      if (!validRules.includes(rule)) {
        return res.status(400).json({ message: `Invalid rule: ${rule}` });
      }
    }
    
    // Find the user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is a committee member
    if (user.userType !== 'committeeMember') {
      return res.status(400).json({ 
        message: 'Rules can only be assigned to committee members' 
      });
    }
    
    // Update rules
    user.rules = rules;
    await user.save();
    
    res.status(200).json({ 
      message: 'User permissions updated successfully',
      user
    });
    
  } catch (error) {
    console.error('Error updating user rules:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to ban or remove an account
router.put("/accounts/ban/:userId", authorizeDean, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Soft delete: deactivate account
    user.isBanned = true; // Add an `isBanned` field in the User schema if not already present
    await user.save();

    res.status(200).json({ message: `User ${user.name} banned successfully` });
  } catch (error) {
    res.status(500).json({ error: "Failed to ban user" });
  }
});

router.get('/research-papers/:status', authorizeDean, async (req, res) => {
  const { status } = req.params;
  const userId = req.user.id;
  console.log(status)
  // Map status to the corresponding "by" field
  const statusByFieldMap = {
    approved: 'approvedBy',
    rejected: 'rejectedBy',
    underReview: 'reviewedBy',
    suspended: 'suspendedBy'
  };

  const statusBy = statusByFieldMap[status];

  if (!statusBy) {
    return res.status(400).json({ error: 'Invalid status type' });
  }

  try {
    const researchPapers = await ResearchPaper.find({
      $and: [
        { status },
        { status: { $ne: 'authorshipConfirmationPending' } },
        { [statusBy]: userId } // dynamic field key
      ]
    });

    res.status(200).json(researchPapers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch research papers' });
  }
});



// Route to unban a user account
router.put("/accounts/unban/:userId", authorizeDean, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isBanned = false; // Reactivate account
    await user.save();

    res
      .status(200)
      .json({ message: `User ${user.name} unbanned successfully` });
  } catch (error) {
    res.status(500).json({ error: "Failed to unban user" });
  }
});

// Route to review research papers
router.get("/research-papers", authorizeDean, async (req, res) => {
  try {
    const researchPapers = await ResearchPaper.find({
      status: { $ne: "authorshipConfirmationPending" },
    });
    res.status(200).json(researchPapers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch research papers" });
  }
});

// Route to approve or reject a research paper
router.put(
  "/research-papers/:paperId/status",
  authorizeDean,
  async (req, res) => {
    const { paperId } = req.params;
    const { status, comments } = req.body; // status can be 'approved' or 'rejected'

    try {
      const paper = await ResearchPaper.findById(paperId);
      if (!paper)
        return res.status(404).json({ error: "Research paper not found" });

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
      paper.comments = comments || null; // Add a `comments` field in the schema if needed
      await paper.save();

      res.status(200).json({ message: `Research paper ${status}` });
    } catch (error) {
      res.status(500).json({ error: "Failed to update research paper status" });
    }
  }
);

// Route to promote a user to committee member
router.put("/accounts/promote/:userId", authorizeDean, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    // Check if user is already a committee member
    if (user.userType === "committeeMember") {
      return res
        .status(400)
        .json({ error: "User is already a committee member" });
    }
    // Save the previous role in case we need to revert
    const previousRole = user.userType;
    // Update user type to committee member
    user.userType = "committeeMember";
    await user.save();
    res.status(200).json({
      message: `User ${user.name} promoted to committee member successfully`,
      previousRole,
    });
  } catch (error) {
    console.error("Error promoting user:", error);
    res.status(500).json({ error: "Failed to promote user" });
  }
});

// Route to demote a user from committee member
router.put("/accounts/demote/:userId", authorizeDean, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    // Check if user is actually a committee member
    if (user.userType !== "committeeMember") {
      return res.status(400).json({ error: "User is not a committee member" });
    }
    user.userType = "faculty";
    await user.save();
    res.status(200).json({
      message: `User ${user.name} demoted from committee member successfully`,
    });
  } catch (error) {
    console.error("Error demoting user:", error);
    res.status(500).json({ error: "Failed to demote user" });
  }
});

/**
 * @route GET /api/dean/research-papers/export
 * @description Get all research papers with complete details for export
 * @access Private (Dean only)
 */
router.get('/research-papers/export', authorizeDean, async (req, res) => {
  try {
    // Fetch research papers with complete data including authors
    const papers = await ResearchPaper.find()
      .select('-__v')
      .sort({ submittedAt: -1 });
    
    console.log(`Sending ${papers.length} papers for export`);
    
    // Ensure all papers have the necessary fields
    const validatedPapers = papers.map(paper => {
      const paperObj = paper.toObject();
      
      // Add default values for potentially missing fields
      return {
        ...paperObj,
        paperTitle: paperObj.paperTitle || 'Untitled',
        department: paperObj.department || 'Not specified',
        pubYear: paperObj.pubYear || 'N/A',
        status: paperObj.status || 'Unknown',
        impactFactor: paperObj.impactFactor || 'N/A',
        totalAwardAmount: paperObj.totalAwardAmount || 0,
        awardCategory: paperObj.awardCategory || 'Unknown',
        authors: Array.isArray(paperObj.authors) ? paperObj.authors.map(author => ({
          ...author,
          name: author.name || 'Unknown',
          email: author.email || `unknown-${Math.random().toString(36).substring(7)}@example.com`,
          isExternal: author.isExternal || false,
          amount: author.amount || 0,
          shareValue: author.shareValue || 0
        })) : []
      };
    });

    res.status(200).json(validatedPapers);
  } catch (error) {
    console.error('Error fetching research papers for export:', error);
    res.status(500).json({ error: 'Failed to fetch research papers' });
  }
});

module.exports = router;
