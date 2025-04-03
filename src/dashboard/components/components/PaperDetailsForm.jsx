import React from "react";
import {
  Grid,
  TextField,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const PaperDetailsForm = ({ formData, handleInputChange }) => {
  return (
    <>
      <Grid item xs={12} sm={6}>
        <InputLabel>Journal Name *</InputLabel>
        <TextField
          fullWidth
          name="journalName"
          value={formData.journalName}
          onChange={handleInputChange}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputLabel>Author Type *</InputLabel>
        <Select
          fullWidth
          name="authorType"
          value={formData.authorType}
          onChange={handleInputChange}
          required
        >
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="firstAuthor">First Author</MenuItem>
          <MenuItem value="correspondingAuthor">Corresponding Author</MenuItem>
        </Select>
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputLabel>
          Impact Factor (as reported by Clarivate Analytics) *
        </InputLabel>
        <TextField
          fullWidth
          name="impactFactor"
          value={formData.impactFactor}
          onChange={handleInputChange}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputLabel>Indexing (as reported by Clarivate Analytics) *</InputLabel>
        <TextField
          fullWidth
          name="indexing"
          value={formData.indexing}
          onChange={handleInputChange}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputLabel>Volume No. *</InputLabel>
        <TextField
          fullWidth
          name="volumeNo"
          value={formData.volumeNo}
          onChange={handleInputChange}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputLabel>Page No. *</InputLabel>
        <TextField
          fullWidth
          name="pageNo"
          value={formData.pageNo}
          onChange={handleInputChange}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputLabel>Year *</InputLabel>
        <TextField
          fullWidth
          name="year"
          value={formData.year}
          onChange={handleInputChange}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputLabel>Publisher *</InputLabel>
        <TextField
          fullWidth
          name="publisher"
          value={formData.publisher}
          onChange={handleInputChange}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputLabel>Paid Journal? *</InputLabel>
        <Select
          fullWidth
          name="isPaidJournal"
          value={formData.isPaidJournal}
          onChange={handleInputChange}
          required
        >
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputLabel>Link to Webpage of Published Paper *</InputLabel>
        <TextField
          fullWidth
          name="paperLink"
          value={formData.paperLink}
          onChange={handleInputChange}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputLabel>DOI of Published Paper *</InputLabel>
        <TextField
          fullWidth
          name="doi"
          value={formData.doi}
          onChange={handleInputChange}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputLabel>Do you have more papers? *</InputLabel>
        <Select
          fullWidth
          name="hasMorePapers"
          value={formData.hasMorePapers}
          onChange={handleInputChange}
          required
        >
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputLabel>Eligible? *</InputLabel>
        <Select
          fullWidth
          name="isEligible"
          value={formData.isEligible}
          onChange={handleInputChange}
          required
        >
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>
      </Grid>
    </>
  );
};

export default PaperDetailsForm;
