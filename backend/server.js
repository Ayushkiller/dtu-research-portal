const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./routes/auth").router; // Import the auth router correctly
const deanRouter = require("./routes/dean");
const researchPaperRouter = require("./routes/researchPaper");
const researchPaperSubmissionRouter = require("./routes/research-paper-submission");
const researchAuthorEmailRouter = require("./routes/sendResearchPaperAuthorEmailConfirmation");
const feedbackRouter = require('./routes/feedback');
const path = require("path");
const app = express();

// Use morgan to log incoming requests
app.use(morgan("combined"));

// Custom middleware to log outgoing responses
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    console.log(`Outgoing response: ${body}`);
    originalSend.call(this, body);
  };
  next();
});

const PORT = process.env.PORT || 9000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/auth", authRouter);
app.use("/dean", deanRouter);
app.use("/research-paper-submission", researchPaperRouter);
app.use("/research-author-email",researchAuthorEmailRouter );
app.use("/research-paper-fetch", researchPaperSubmissionRouter);
app.use('/feedback', feedbackRouter);
// Create uploads directory if it doesn't exist
const fs = require("fs");
const uploadsDir = path.join(__dirname, "uploads/photographs");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// MongoDB Connection
mongoose
  .connect("mongodb+srv://admin:OvpIVRbKRSH92ZQW@cluster0.hymysuv.mongodb.net/dtu-research-portal")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("DTU Research Portal Backend Running");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
