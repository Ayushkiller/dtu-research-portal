import React from "react";
import { Grid, TextField, MenuItem,Box } from "@mui/material";
import { useFileUpload } from "../../hooks/useFileUpload";
export default function PersonalInformation({ formData, handleChange }) {
    const { preview, handleFileChange } = useFileUpload();
    const applicantTypeOptions = [
        { value: "student", label: "Student" },
        { value: "faculty", label: "Faculty" },
        { value: "researcher", label: "Researcher" },
      ];
  return (
    <>
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
        <Grid container item xs={12} spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Applicant Photograph"
              name="photograph"
              type="file"
              onChange={handleFileChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: "image/*" }}
            />
          </Grid>
          {preview && (
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Box
                component="img"
                src={preview}
                alt="Applicant Photograph"
                sx={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 1,
                  boxShadow: 1,
                  border: "1px solid rgba(0,0,0,0.23)",
                }}
              />
            </Grid>
          )}
        </Grid>
    </Grid>
    </>
  );
}
