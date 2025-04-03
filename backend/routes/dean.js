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

module.exports = router;
