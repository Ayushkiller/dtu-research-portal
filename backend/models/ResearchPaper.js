const mongoose = require('mongoose');

const researchPaperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authorsInternal: [{ type: String, required: true }],
  authorsExternal: [{ type: String }],
  googleDriveLink: { type: String, required: true },
  impactFactor: { type: Number },
  indexing: { type: String },
  journalName: { type: String, required: true },
  year: { type: Number, required: true },
  publisher: { type: String },
  awardDistribution: {
    firstAuthor: { type: Number, default: 0 },
    coAuthors: [{ type: Number }],
  },
  committeeRemarks: [
    {
      reviewer: { type: String }, // Committee member's email
      remark: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  status: { type: String, enum: ['pending', 'round1', 'round2', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ResearchPaper', researchPaperSchema);
