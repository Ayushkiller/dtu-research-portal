import React, { useState } from 'react';
import { TextField, Button, Grid, MenuItem, Box } from '@mui/material';
import { calculateAuthorShares } from './awardDistributionUtils';
import { useFileUpload } from '../hooks/useFileUpload';
export default function ResearchPaperSubmissionForm({ onSubmit }) {
  const { file, preview, handleFileChange } = useFileUpload();
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
    totalAwardAmount: 500000,
    authors: [
      {
        name: '',
        email: '',
        mobileNo: '',
        isExternal: false,
        bankDetails: {
          bankName: '',
          branch: '',
          accountNo: '',
          ifscCode: ''
        },
        shareValue: 0
      }
    ]
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleAuthorChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.map((author, i) =>
        i === index ? { ...author, [field]: value } : author
      )
    }));
  };

  const handleAddAuthor = () => {
    setFormData(prev => ({
      ...prev,
      authors: [
        ...prev.authors,
        {
          name: '',
          email: '',
          mobileNo: '',
          isExternal: false,
          bankDetails: {
            bankName: '',
            branch: '',
            accountNo: '',
            ifscCode: ''
          },
          shareValue: 0
        }
      ]
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

  const { authors, totalAwardAmount } = formData;
  const authorShares = calculateAuthorShares(authors, totalAwardAmount);

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
            onChange={handleFileChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: 'image/*' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {preview && (
            <Box
              component="img"
              src={preview}
              alt="Applicant Photograph"
              sx={{
                width: 100,
                height: 100,
                objectFit: 'cover',
                borderRadius: 1,
                boxShadow: 1,
              }}
            />
          )}
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
            label="Research Paper Link"
            name="researchPaperLink"
            type="url"
            value={formData.researchPaperLink}
            onChange={handleChange}
            required
            variant="outlined"
          />
        </Grid>
         <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Indexing(SCI/SCIE)"
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
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Total Award Amount"
            name="totalAwardAmount"
            type="number"
            value={totalAwardAmount}
            disabled
            variant="outlined"
          />
        </Grid>

        {authorShares.map((author, index) => (
          <React.Fragment key={index}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={`Author ${index + 1} Name`}
                value={author.name}
                onChange={e => handleAuthorChange(index, 'name', e.target.value)}
                required
                variant="outlined"
              />
            </Grid>
            {author.isExternal && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`Author ${index + 1} Bank Name`}
                    value={author.bankDetails.bankName}
                    onChange={e => handleAuthorChange(index, 'bankDetails.bankName', e.target.value)}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`Author ${index + 1} Bank Branch`}
                    value={author.bankDetails.branch}
                    onChange={e => handleAuthorChange(index, 'bankDetails.branch', e.target.value)}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`Author ${index + 1} Account No.`}
                    value={author.bankDetails.accountNo}
                    onChange={e => handleAuthorChange(index, 'bankDetails.accountNo', e.target.value)}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`Author ${index + 1} IFSC Code`}
                    value={author.bankDetails.ifscCode}
                    onChange={e => handleAuthorChange(index, 'bankDetails.ifscCode', e.target.value)}
                    required
                    variant="outlined"
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={`Author ${index + 1} Award Amount`}
                value={author.amount}
                disabled
                variant="outlined"
              />
            </Grid>
          </React.Fragment>
        ))}

        <Grid item xs={12}>
          <Button onClick={handleAddAuthor} color="primary" variant="contained">
            Add Author
          </Button>
        </Grid>
      </Grid>
      <Button type="submit" color="primary" variant="contained">
        Submit Paper
      </Button>
    </form>
  );
}