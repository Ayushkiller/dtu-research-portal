const express = require("express");
const User = require("../models/User");
const OTP = require("../models/OTP"); // You'll need to create this model
const router = express.Router();
const jwt = require("jsonwebtoken");
const LoginOtpEmail = require("../services/emails/loginOtpEmail");
const { 
  generateOTP, 
  hashOTP, 
  verifyOTP, 
  getOTPExpiry, 
  isOTPExpired 
} = require("../utils/otpUtils");

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "sdgzgdzsfdjhgzjufygjuzasyfgjuzsyjfgsjzymgjfzmjayushkillesyoumany";
const OTP_EXPIRY_MINUTES = 10;

// Register User
router.post("/register", async (req, res) => {
  try {
    const {
      email,
      name,
      password,
      userType,
      employeeId,
      department,
      mobileNumber,
      applicantPhoto,
      applicantBiography,
      dateOfBirth,
      address,
      bankAccount,
      bankName,
      branchName,
      ifsc,
      accountHolderName,
    } = req.body;

    // Validate required fields
    if (
      !email ||
      !name ||
      !password ||
      !userType ||
      !employeeId ||
      !department ||
      !mobileNumber
    ) {
      return res.status(400).send({
        error: "Missing required fields",
        message: "Please fill in all required fields",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).send({ error: "Email already in use." });

    // Convert date string to Date object if present
    const formattedDateOfBirth = dateOfBirth
      ? new Date(dateOfBirth)
      : undefined;

    // Create new user with all fields from signup form
    const user = new User({
      email,
      name,
      password, // Note: You should hash this password for security
      userType,
      employeeId,
      department,
      mobileNumber,
      applicantPhoto,
      applicantBiography,
      dateOfBirth: formattedDateOfBirth,
      address,
      bankAccount,
      bankName,
      branchName,
      ifsc,
      accountHolderName,
    });

    await user.save();

    res.status(201).send({ message: "User registered successfully." });
  } catch (error) {
    console.error("Registration error:", error);

    // Check for validation errors from Mongoose
    if (error.name === "ValidationError") {
      const validationErrors = Object.keys(error.errors).map((field) => ({
        field,
        message: error.errors[field].message,
      }));

      return res.status(400).send({
        error: "Validation error",
        details: validationErrors,
      });
    }

    res.status(500).send({ error: error.message });
  }
});

// Traditional Password Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: "User not found." });
    if (user.password !== password)
      return res.status(401).send({ error: "Invalid password." });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        userType: user.userType,
        name: user.name,
        department: user.department,
        mobileNumber: user.mobileNumber,
        employeeId: user.employeeId,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).send({ message: "Login successful", token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Request OTP for login
router.post("/request-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ 
        error: "Missing email", 
        message: "Email is required" 
      });
    }


    // Check for existing non-expired OTPs and rate limiting
    const existingOTP = await OTP.findOne({ 
      email, 
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (existingOTP) {
      // Calculate time since creation in seconds
      const timeSinceCreation = Math.floor((Date.now() - existingOTP.createdAt) / 1000);
      
      // Rate limit: Allow new OTP only after 60 seconds
      if (timeSinceCreation < 60) {
        return res.status(429).send({ 
          error: "Rate limit exceeded", 
          message: `Please wait ${60 - timeSinceCreation} seconds before requesting another OTP` 
        });
      }

      // Invalidate previous OTP
      await OTP.updateOne({ _id: existingOTP._id }, { isUsed: true });
    }

    // Generate new OTP
    const otpCode = generateOTP(6);
    const hashedOTP = await hashOTP(otpCode);
    const expiresAt = getOTPExpiry(OTP_EXPIRY_MINUTES);

    const otpRecord = await OTP.findOne({ 
      email, 
      isUsed: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (otpRecord) {
      //delete previous OTP record
      await OTP.deleteOne({ _id: otpRecord._id });
    }

    // Save OTP to database
    await OTP.create({
      email,
      otp: hashedOTP,
      expiresAt,
      createdAt: new Date()
    });

    // Send OTP email
    const otpEmail = new LoginOtpEmail(
      email,
      email,
      otpCode,
      OTP_EXPIRY_MINUTES
    );

    await otpEmail.sendTo(email);

    return res.status(200).send({ 
      message: `OTP sent to ${email}` 
    });
  } catch (error) {
    console.error("OTP Request Error:", error);
    return res.status(500).send({ 
      error: "Server error", 
      message: "Error sending OTP, please try again later" 
    });
  }
});

// Verify OTP and login
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).send({ 
        error: "Missing fields", 
        message: "Email and OTP are required" 
      });
    }

    console.log("Verifying OTP for email:", email);
    console.log("Received OTP:", otp);

    // Find the latest OTP for this email that hasn't been used
    const otpRecord = await OTP.findOne({ 
      email, 
      isUsed: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    // If no valid OTP found
    if (!otpRecord) {
      return res.status(400).send({ 
        error: "Invalid OTP", 
        message: "OTP is invalid or expired" 
      });
    }

    console.log("Found OTP record:", otpRecord);

    // Check if max attempts exceeded
    const MAX_OTP_ATTEMPTS = 5;
    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      await OTP.updateOne({ _id: otpRecord._id }, { isUsed: true });
      return res.status(401).send({ 
        error: "Max attempts exceeded", 
        message: "Maximum verification attempts exceeded. Please request a new OTP." 
      });
    }



    // Increment attempt counter
    await OTP.updateOne(
      { _id: otpRecord._id },
      { $inc: { attempts: 1 } }
    );

    

    // Verify OTP
    const isValid = await verifyOTP(otp, otpRecord.otp);
    console.log("Is OTP valid:", isValid);
    if (!isValid) {
      return res.status(401).send({ 
        error: "Invalid OTP", 
        message: "Incorrect OTP" 
      });
    }

    // Mark OTP as used
    await OTP.updateOne({ _id: otpRecord._id }, { isUsed: true });

    // Get user
  

   

    return res.status(200).send({
      message: "Verified Otp",
    });
  } catch (error) {
    console.log("OTP Verification Error:", error);
    return res.status(500).send({ 
      error: "Server error", 
      message: "Error verifying OTP, please try again later" 
    });
  }
});

module.exports = { router };