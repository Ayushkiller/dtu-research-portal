const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  userType: { 
    type: String, 
    enum: ['faculty', 'student', 'researchScholar', 'committeeMember', 'competentAuthority'], 
    required: true 
  },
 // Enhanced rules array with structured objects instead of simple strings
 rules: [{
  required: true,
  default: [
    'canReviewPaper',
    'canRejectPaper',
    'canApprovePaper',
    'canSuspendPaper',
  ], 
  type: String, 
  enum: [
    'canReviewPaper', 
    'canRejectPaper', 
    'canApprovePaper',
    'canSuspendPaper',

  ]
}],
  applicantBiography: { type: String, required: false },
  applicantPhoto: { type: String, required: false },
  department: { type: String, required: true },
  employeeId: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date }, // New field
  address: { type: String },   // New field
  bankAccount: { type: String },
  bankName: { type: String },
  branchName: { type: String },
  ifsc: { type: String },
  accountHolderName: { type: String },
  isBanned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
