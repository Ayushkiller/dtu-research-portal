import React from "react";
import { Grid, TextField } from "@mui/material";

export default function BankDetails({ formData, handleChange }) {
  return (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Bank Name"
          name="bankDetails.bankName"
          value={formData.bankDetails.bankName}
          onChange={handleChange}
          required
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Branch"
          name="bankDetails.branch"
          value={formData.bankDetails.branch}
          onChange={handleChange}
          required
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Account Number"
          name="bankDetails.accountNo"
          value={formData.bankDetails.accountNo}
          onChange={handleChange}
          required
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="IFSC Code"
          name="bankDetails.ifscCode"
          value={formData.bankDetails.ifscCode}
          onChange={handleChange}
          required
          variant="outlined"
        />
      </Grid>
    </>
  );
}