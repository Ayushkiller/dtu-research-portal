const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const authRouter = require('./routes/auth').router; // Import the auth router correctly
const researchPaperRouter = require('./routes/researchPaper');
const path = require('path');
const app = express();

// Use morgan to log incoming requests
app.use(morgan('combined'));

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/auth', authRouter);
app.use('/research-paper-submission', researchPaperRouter);
// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads/photographs');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb+srv://Ayushkiller:dturesearch@cluster0.i9tfv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRouter); // Use the auth router
app.post("/research-paper-submission", (req, res) => {
  res.status(200).json({success : true ,message:"Succesfully Recieved request for submission"})
})
// Test Route
app.get('/', (req, res) => {
  res.send('DTU Research Portal Backend Running');
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));