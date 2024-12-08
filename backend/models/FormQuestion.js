const mongoose = require("mongoose");

// Schema for form questions
const formQuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true }, // The text of the question
  questionType: { type: String, default: "text" }, // e.g., text, radio, checkbox
  options: [{ type: String }], // Optional: for multiple-choice questions
  isRequired: { type: Boolean, default: false }, // Whether this question is mandatory
});

module.exports = mongoose.model("FormQuestion", formQuestionSchema);
