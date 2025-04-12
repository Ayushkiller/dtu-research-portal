import React from "react";
import {
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import AuthorsList from "./FormFields/AuthorsList";
import { AWARD_CATEGORIES } from "../utils/awardDistributionUtils";

const ReviewStep = ({ formData }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Review Your Submission</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Award Category:</strong>{" "}
          {AWARD_CATEGORIES[formData.awardCategory].label} - ₹
          {formData.totalAwardAmount.toLocaleString()}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          Paper Information
        </Typography>
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Paper Title:</strong> {formData.paperTitle}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Publication Year:</strong> {formData.pubYear}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Journal Name:</strong> {formData.journalName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Author Type:</strong> {formData.authorType}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Impact Factor:</strong> {formData.impactFactor}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Indexing:</strong> {formData.indexing}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Volume No:</strong> {formData.volumeNo}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Page No:</strong> {formData.pageNo}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Year:</strong> {formData.year}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Publisher:</strong> {formData.publisher}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Paid Journal:</strong> {formData.isPaidJournal}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Paper Link:</strong> {formData.paperLink}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>DOI:</strong> {formData.doi}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>More Papers?:</strong> {formData.hasMorePapers}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Eligible:</strong> {formData.isEligible}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle1">Authors</Typography>
        <AuthorsList
          authors={formData.authors}
          editable={false}
          totalAwardAmount={formData.totalAwardAmount}
        />
        {formData.authors.length > 0 &&
          formData.awardCategory === "COMMENDABLE" && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Note: An author can claim the Commendable Research Award for a
              maximum of three papers per year.
            </Typography>
          )}
      </Grid>
    </Grid>
  );
};

export default ReviewStep;
