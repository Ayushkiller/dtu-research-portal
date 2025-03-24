const express = require("express");
const User = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");

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
      password,
      userType,
      employeeId,
      department,
      mobileNumber,
      applicantPhoto,
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

const JWT_SECRET =
  "sdgzgdzsfdjhgzjufygjuzasyfgjuzsyjfgsjzymgjfzmjayushkillesyoumany";
// Login User
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

module.exports = { router };
