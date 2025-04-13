const Email = require("../emailService");
const { COPYRIGHT_YEAR, DEVELOPER_FOOTER } = require("../emailService");
const APP_URL = "https://dtu-research-portal.onrender.com";

class LoginOtpEmail extends Email {
  constructor(
    userName, // User's name
    userEmail, // User's email
    otpCode, // One-time password code
    otpExpiryMinutes = 10 // OTP expiration time in minutes
  ) {
    super(); // Call the parent constructor

    // Set the email subject
    this.subject = `Your Login OTP Code`;

    // Calculate expiry time for display
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + otpExpiryMinutes);
    const formattedExpiryTime = expiryTime.toLocaleTimeString();

    // Set the HTML body for the email
    this.html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Login OTP Code</title>
        </head>
        <body>
          <h1>Hi ${userName},</h1>
          <p>
            Your one-time password (OTP) for logging into your account is:
          </p>
          <div style="padding: 15px; background-color: #f0f0f0; border-radius: 5px; font-size: 24px; text-align: center; letter-spacing: 5px; font-weight: bold;">
            ${otpCode}
          </div>
          <p>
            This code will expire at ${formattedExpiryTime} (valid for ${otpExpiryMinutes} minutes).
          </p>
          <p>
            If you did not request this code, please ignore this email or contact support if you have concerns about your account security.
          </p>
          <br/>
          <p>Thanks,</p>
          <p>${DEVELOPER_FOOTER}</p>
          <p>&copy; ${COPYRIGHT_YEAR} Your Application Name. All rights reserved.</p>
        </body>
      </html>
    `;
  }
}

module.exports = LoginOtpEmail;