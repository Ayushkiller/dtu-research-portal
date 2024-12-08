import React from "react";
import { Grid, TextField, MenuItem } from "@mui/material";

export default function PaperDetails({ formData, handleChange }) {
  return (
    <>
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
            { value: "first", label: "First Author" },
            { value: "corresponding", label: "Corresponding Author" },
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
    </>
  );
}
