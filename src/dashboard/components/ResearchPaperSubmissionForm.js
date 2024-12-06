import React, { useState } from 'react';
import { TextField, Button, Grid, MenuItem } from '@mui/material';

export default function ResearchPaperSubmissionForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    mobileNo: '',
    department: '',
    applicantType: '',
    photograph: null,
    biography: '',
    paperTitle: '',
    journalName: '',
    authorType: '',
    impactFactor: '',
    indexing: '',
    volumeNo: '',
    pageNo: '',
    publicationYear: '',
    publisher: '',
    isPaidJournal: '',
    paperLink: '',
    doi: '',
    externalAuthors: '',
    internalAuthors: '',
    awardShareValue: '',
    totalAwardAmount: '',
    firstAuthorAmount: '',
    coAuthor1Amount: '',
    coAuthor2Amount: '',
    coAuthor3Amount: '',
    coAuthor4Amount: '',
    firstAuthorBankDetails: '',
    coAuthor1BankDetails: '',
    coAuthor2BankDetails: '',
    coAuthor3BankDetails: '',
    coAuthor4BankDetails: '',
    hasMorePapers: ''
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  const applicantTypeOptions = [
    { value: 'student', label: 'Student' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'researcher', label: 'Researcher' }
  ];

  const yesNoOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* Personal Information */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Name of the Applicant"
            name="applicantName"
            value={formData.applicantName}
            onChange={handleChange}
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mobile No."
            name="mobileNo"
            type="tel"
            value={formData.mobileNo}
            onChange={handleChange}
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Department Name"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Applicant Type"
            name="applicantType"
            value={formData.applicantType}
            onChange={handleChange}
            required
            variant="outlined"
          >
            {applicantTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Applicant Photograph"
            name="photograph"
            type="file"
            onChange={handleChange}
            required
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: 'image/*' }}
          />
        </Grid>

        {/* Paper Details */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Applicant Biography (200 words)"
            name="biography"
            multiline
            rows={4}
            value={formData.biography}
            onChange={handleChange}
            required
            variant="outlined"
            helperText="Maximum 200 words"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Paper Title"
            name="paperTitle"
            value={formData.paperTitle}
            onChange={handleChange}
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Journal Name"
            name="journalName"
            value={formData.journalName}
            onChange={handleChange}
            required
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="First/Corresponding Author?"
            name="authorType"
            value={formData.authorType}
            onChange={handleChange}
            required
            variant="outlined"
          >
            {[
              { value: 'first', label: 'First Author' },
              { value: 'corresponding', label: 'Corresponding Author' },
              { value: 'both', label: 'Both' }
            ].map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Impact Factor"
            name="impactFactor"
            value={formData.impactFactor}
            onChange={handleChange}
            required
            variant="outlined"
            helperText="As reported by Clarivate Analytics"
          />
        </Grid>

        {/* Additional Fields */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Indexing"
            name="indexing"
            value={formData.indexing}
            onChange={handleChange}
            required
            variant="outlined"
            helperText="As reported by Clarivate Analytics"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Publication Year"
            name="publicationYear"
            type="number"
            value={formData.publicationYear}
            onChange={handleChange}
            required
            variant="outlined"
          />
        </Grid>

        {/* Financial and Additional Details */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Award Share Value (Z)"
            name="awardShareValue"
            type="number"
            inputProps={{ step: "0.1", max: "1" }}
            value={formData.awardShareValue}
            onChange={handleChange}
            required
            variant="outlined"
            helperText="Z <= 1, refer to award distribution formula"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Total Award Amount"
            name="totalAwardAmount"
            type="number"
            value={formData.totalAwardAmount}
            onChange={handleChange}
            required
            variant="outlined"
            helperText="After subtracting external authors"
          />
        </Grid>

        {/* Bank Details */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Bank Details (First/Corresponding Author)"
            name="firstAuthorBankDetails"
            value={formData.firstAuthorBankDetails}
            onChange={handleChange}
            required
            variant="outlined"
            helperText="Name of Bank, Branch, Account Number, IFSC Code"
          />
        </Grid>

        {/* Additional Submission Question */}
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Do you have more papers?"
            name="hasMorePapers"
            value={formData.hasMorePapers}
            onChange={handleChange}
            required
            variant="outlined"
          >
            {yesNoOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Button type="submit" color="primary" variant="contained">
        Submit Paper
      </Button>
    </form>
  );
}