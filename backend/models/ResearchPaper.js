const mongoose = require("mongoose");
const researchPaperSchema = new mongoose.Schema({
  status: {
    type: String,
    default: "authorshipConfirmationPending",
    enum: ["Submitted", "Under Review", "approved", "rejected","authorshipConfirmationPending"],
  },
  applicantName: { type: String, required: true },
  email: { type: String, required: true },
  mobileNo: { type: String, required: true },
  department: { type: String, required: true },
  applicantType: { type: String, required: true },
  photograph: { type: String }, // Store file path or URL
  bankDetails: {
    bankName: { type: String, required: true },
    branch: { type: String, required: true },
    accountNo: { type: String, required: true },
    ifscCode: { type: String, required: true },
  },
  totalAwardAmount: { type: Number, required: true },
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

  // Storing answers to dynamic form questions
  paperDetails: {
    type: Map,
    of: mongoose.Schema.Types.Mixed, // Supports different answer types like text, array, etc.
  },
});

module.exports = mongoose.model("ResearchPaper", researchPaperSchema);
