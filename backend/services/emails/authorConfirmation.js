const Email = require("../emailService");
const {  COPYRIGHT_YEAR, DEVELOPER_FOOTER } = require("../emailService");
const APP_URL = "https://dtu-research-portal.vercel.app";

class ResearchPaperAuthorEmail extends Email {
  constructor(
    authorName, // Author's name
    paperTitle, // Research paper title
    submissionId, // Unique submission ID of the research paper
    confirmationToken // Unique token for confirming authorship
  ) {
    super(); // Call the parent constructor

    // Set the email subject
    this.subject = `Confirmation of Authorship for Research Paper: ${paperTitle}`;

    // Set the HTML body for the email
    this.html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorship Confirmation</title>
        </head>
        <body>
          <h1>Hi ${authorName},</h1>
          <p>
            You have been listed as an author for the research paper titled:
            <strong>${paperTitle}</strong>.
          </p>
          <p>
            Please confirm your authorship by clicking the link below. This will
            help us verify your contribution to the research paper.
          </p>
          <a href="${APP_URL}/confirm-authorship?submissionId=${submissionId}&token=${confirmationToken}" 
             style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Confirm Authorship
          </a>
          <p>If the button above does not work, copy and paste the link below into your browser:</p>
          <p>${APP_URL}/confirm-authorship?submissionId=${submissionId}&token=${confirmationToken}</p>
          <br/>
          <p>Thanks,</p>
          <p>Developed By...</p>
          
        </body>
      </html>
    `;
  }
}

module.exports = ResearchPaperAuthorEmail;
