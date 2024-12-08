const mongoose = require('mongoose');

const researchPaperSchema = new mongoose.Schema({
  applicantName: { type: String, required: true },
  email: { type: String, required: true },
  mobileNo: { type: String, required: true },
  department: { type: String, required: true },
  applicantType: { type: String, required: true },
  photograph: { type: String }, // Store file path or URL
  biography: { type: String, required: true },
  paperTitle: { type: String, required: true },
  journalName: { type: String, required: true },
  authorType: { type: String, required: true },
  impactFactor: { type: String, required: true },
  indexing: { type: String, required: true },
  publicationYear: { type: Number, required: true },
  researchPaperLink: { type: String, required: true },
  bankDetails: {
    bankName: { type: String, required: true },
    branch: { type: String, required: true },
    accountNo: { type: String, required: true },
    ifscCode: { type: String, required: true }
  },
  totalAwardAmount: { type: Number, required: true },
  authors: [{
    name: { type: String },
    email: { type: String },
    mobileNo: { type: String },
    isExternal: { type: Boolean, default: false },
    bankDetails: {
      bankName: { type: String },
      branch: { type: String }, 
      accountNo: { type: String },
      ifscCode: { type: String }
    },
    shareValue: { type: Number }
  }],
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ResearchPaper', researchPaperSchema);
