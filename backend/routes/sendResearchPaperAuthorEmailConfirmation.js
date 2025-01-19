const express = require("express");
const { default: mongoose } = require("mongoose");

const ResearchPaperAuthorEmail = require("../services/emails/authorConfirmation");
const ResearchPaper = require("../models/ResearchPaper");

const router = express.Router();

/**
 * @route POST /api/send-research-paper-emails
 * @description Sends confirmation emails to authors of a research paper
 * @access Public
 */

router.post("/send", async (req, res) => {
  try {
    // Destructure the request body
    const { authors, paperTitle, submissionId } = req.body;

    // Validate input
    if (!authors || !Array.isArray(authors) || authors.length === 0) {
      return res.status(400).json({ error: "Authors array is required." });
    }
    if (!paperTitle) {
      return res.status(400).json({ error: "Paper title is required." });
    }
    if (!submissionId) {
      return res.status(400).json({ error: "Submission ID is required." });
    }

    // Iterate over each author and send an email
    const emailResults = [];
    for (const author of authors) {
      const { name, email, token } = author;

      if (!name || !email || !token) {
        emailResults.push({
          name,
          email,
          status: "failed",
          error: "Missing author details (name, email, or token).",
        });
        continue;
      }

      const authorEmail = new ResearchPaperAuthorEmail(
        name,
        paperTitle,
        submissionId,
        token
      );
      const isEmailSent = await authorEmail.sendTo(email);

      emailResults.push({
        name,
        email,
        status: isEmailSent ? "success" : "failed",
      });
    }

    // Return a response with the email results
    res.status(200).json({
      message: "Emails processed.",
      results: emailResults,
    });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/confirm-authorship", async (req, res) => {
  try {
    const { submissionId, token } = req.body;

    if (!submissionId || !token) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid data provided." });
    }
    const researchPaper = await ResearchPaper.findById(submissionId);
    console.log(researchPaper);
    
    researchPaper.authors.forEach((author) => {
      if (author.confirmationToken.token === token) {
        author.confirmationStatus = true;
        author.confirmationToken.used = true;
      }
    });
    await researchPaper.save();
    if (!researchPaper) {
      return res
        .status(404)
        .json({ success: false, message: "Research paper not found." });
    }
    if (
      researchPaper.authors.every(
        (author) => author.confirmationStatus === true
      )
    ) {
      researchPaper.status = "Submitted";
      await researchPaper.save();
    }
    res
      .status(200)
      .json({ success: true, message: "Authorship confirmed successfully." });
  } catch (error) {
    console.log("Error confirming authorship:", error);
  }
});

module.exports = router;
