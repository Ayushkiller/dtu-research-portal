const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  userType: { 
    type: String, 
    enum: ['faculty', 'student', 'researchScholar', 'committeeMember', 'competentAuthority'], 
    required: true 
  },
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
  createdAt: { type: Date, default: Date.now },
  powers: { 
    type: [String], // Array of strings to allow multiple powers
    enum: [
      'suspendResearchPaper', 
      'unsuspendResearchPaper', 
      'putUnderReview', 
      'addRemarks', 
      'flagQuestion',
      'unflagQuestion', 
      'changeShareAmount',
      "approveResearchPaper",
      "rejectResearchPaper",
    ],
    default: [] // Default to no powers assigned
  }
});

module.exports = mongoose.model('User', userSchema);
