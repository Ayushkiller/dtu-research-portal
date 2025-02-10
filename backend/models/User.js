const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  employeeId: { type: String, required: true },
  userType: { 
    type: String, 
    enum: ['faculty', 'student', 'researchScholar', 'committeeMember', 'competentAuthority'], 
    required: true 
  },
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
