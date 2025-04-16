// utils/otpUtils.js
const crypto = require('crypto');
const bcrypt = require('bcrypt');

/**
 * Generates a random numeric OTP of specified length
 * @param {number} length - Length of the OTP (default: 6)
 * @returns {string} - Generated OTP
 */
function generateOTP(length = 6) {
  // Generate a random number with the specified number of digits
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const otp = Math.floor(min + Math.random() * (max - min + 1))
    .toString()
    .padStart(length, '0');
  
  return otp;
}

/**
 * Hashes an OTP for secure storage
 * @param {string} otp - The OTP to hash
 * @returns {Promise<string>} - Hashed OTP
 */
async function hashOTP(otp) {
  const saltRounds = 10;
  return bcrypt.hash(otp, saltRounds);
}

/**
 * Verifies an OTP against a hashed value
 * @param {string} plainOTP - The plain text OTP to verify
 * @param {string} hashedOTP - The hashed OTP from the database
 * @returns {Promise<boolean>} - Whether the OTP is valid
 */
async function verifyOTP(plainOTP, hashedOTP) {
  return bcrypt.compare(plainOTP, hashedOTP);
}

/**
 * Calculates OTP expiration timestamp
 * @param {number} expiryMinutes - Minutes until expiration
 * @returns {Date} - Expiration timestamp
 */
function getOTPExpiry(expiryMinutes = 10) {
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + expiryMinutes);
  return expiryDate;
}

/**
 * Checks if an OTP has expired
 * @param {Date} expiryTimestamp - The expiration timestamp
 * @returns {boolean} - Whether the OTP has expired
 */
function isOTPExpired(expiryTimestamp) {
  const now = new Date();
  return now > new Date(expiryTimestamp);
}

module.exports = {
  generateOTP,
  hashOTP,
  verifyOTP,
  getOTPExpiry,
  isOTPExpired
};