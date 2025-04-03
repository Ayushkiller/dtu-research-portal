const mongoose = require("mongoose");

const researchPaperSchema = new mongoose.Schema(
  {
    paperTitle: { type: String, required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    suspendedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      default: "authorshipConfirmationPending",
      enum: [
        "Submitted",
        "suspended",
        "underReview",
        "approved",
        "rejected",
        "authorshipConfirmationPending",
      ],
    },
    pubYear: { type: String, required: true },
    applicantName: { type: String, required: true },
    email: { type: String, required: true },
    mobileNo: { type: String, required: true },
    department: { type: String, required: true },
    applicantType: { type: String, required: true },
    applicantBiography: { type: String, required: false },
    employeeId: { type: String, required: true },
    photograph: { type: String },
    totalAwardAmount: { type: Number, required: true },
    journalName: { type: String, required: true },
    authorType: { type: String, required: true },
    impactFactor: { type: String, required: true },
    indexing: { type: String, required: true },
    volumeNo: { type: String, required: true },
    pageNo: { type: String, required: true },
    year: { type: String, required: true },
    publisher: { type: String, required: true },
    isPaidJournal: { type: String, required: true },
    paperLink: { type: String, required: true },
    doi: { type: String, required: true, unique: true },
    hasMorePapers: { type: String, required: true },
    isEligible: { type: String, required: true },

    authors: [
      {
        name: { type: String },
        email: { type: String },
        mobileNo: { type: String },
        isExternal: { type: Boolean, default: false },
        confirmationStatus: { type: Boolean, default: false },
        confirmationToken: {
          token: { type: String },
          used: { type: Boolean, default: false },
        },
        bankDetails: {
          bankName: { type: String },
          branch: { type: String },
          accountNo: { type: String },
          ifscCode: { type: String },
        },
        shareValue: { type: Number },
      },
    ],
    submittedAt: { type: Date, default: Date.now },

    // Keep the existing paperDetails map for backward compatibility
    paperDetails: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },

    applicantEmail: { type: String },
  },
  { timestamps: true }
);

// Add this to help with debugging
researchPaperSchema.set("toJSON", {
  transform: function (doc, ret) {
    return ret;
  },
});

module.exports = mongoose.model("ResearchPaper", researchPaperSchema);
