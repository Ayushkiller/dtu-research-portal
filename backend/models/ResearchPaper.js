const mongoose = require("mongoose");
const researchPaperSchema = new mongoose.Schema({
  paperTitle: { type: String, required: true },
  approvedBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  suspendedBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectedBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    default: "authorshipConfirmationPending",
    enum: ["Submitted","suspended", "underReview", "approved", "rejected","authorshipConfirmationPending"],
  },
  pubYear: { type: String, required: true },
  applicantName: { type: String, required: true },
  email: { type: String, required: true },
  mobileNo: { type: String, required: true },
  department: { type: String, required: true },
  applicantType: { type: String, required: true },
  photograph: { type: String },
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
  paperDetails: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  applicantEmail: { type: String },
}, { timestamps: true });

// Add this to help with debugging
researchPaperSchema.set('toJSON', {
  transform: function(doc, ret) {
    return ret;
  }
});

module.exports = mongoose.model("ResearchPaper", researchPaperSchema);
