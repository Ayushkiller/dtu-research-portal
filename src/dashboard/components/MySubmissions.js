import * as React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import API from "../../api/axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function MySubmissions() {
  const [submissions, setSubmissions] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedSubmission, setSelectedSubmission] = React.useState(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("token");
        if (!token) {
          setError("No token found");
          return;
        }

        const decodedToken = jwtDecode(token);
        if (!decodedToken.email) {
          setError("No email in token");
          return;
        }

        console.log("Fetching submissions for:", decodedToken.email); // Debug log

        const response = await API.get(
          `/research-paper-fetch/user/${decodedToken.email}`
        );
        console.log("Submissions response:", response.data); // Debug log
        setSubmissions(response.data);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const getStatusChipColor = (status) => {
    switch (status) {
      case "Submitted":
        return "primary";
      case "suspended":
        return "warning";
      case "underReview":
        return "info";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "authorshipConfirmationPending":
        return "secondary";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatStatus = (status) => {
    switch (status) {
      case "Submitted":
        return "Submitted";
      case "suspended":
        return "Suspended";
      case "underReview":
        return "Under Review";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "authorshipConfirmationPending":
        return "Authorship Confirmation Pending";
      default:
        return status;
    }
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  // Add error display
  if (error) {
    return (
      <Box sx={{ width: "100%", p: 3 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  // Add loading indicator
  if (loading) {
    return (
      <Box sx={{ width: "100%", p: 3, textAlign: "center" }}>
        <Typography>Loading submissions...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        My Research Paper Submissions
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="submissions table">
          <TableHead>
            <TableRow>
              <TableCell>Paper Title</TableCell>
              <TableCell>Submission Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Comments</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission._id}>
                <TableCell component="th" scope="row">
                  {submission.paperTitle ||
                    (submission.paperDetails &&
                      submission.paperDetails[
                        Object.keys(submission.paperDetails)[0]
                      ]?.answer) ||
                    "Untitled"}
                </TableCell>
                <TableCell>{formatDate(submission.createdAt)}</TableCell>
                <TableCell>
                  <Chip
                    label={formatStatus(submission.status)}
                    color={getStatusChipColor(submission.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{submission.comments || "-"}</TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleViewDetails(submission)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {submissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No submissions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Submission Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedSubmission && (
          <>
            <DialogTitle>
              Submission Details
              <Chip
                label={formatStatus(selectedSubmission.status)}
                color={getStatusChipColor(selectedSubmission.status)}
                size="small"
                sx={{ ml: 2 }}
              />
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    {selectedSubmission.paperTitle}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Applicant</Typography>
                  <Typography>{selectedSubmission.applicantName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Department</Typography>
                  <Typography>{selectedSubmission.department}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography>{selectedSubmission.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Publication Year</Typography>
                  <Typography>{selectedSubmission.pubYear}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Authors</Typography>
                  {selectedSubmission.authors &&
                  selectedSubmission.authors.length > 0 ? (
                    selectedSubmission.authors.map((author, index) => (
                      <Typography key={index}>
                        {author.name} {author.isExternal ? "(External)" : ""}
                        {author.confirmationStatus
                          ? " - Confirmed"
                          : " - Pending Confirmation"}
                      </Typography>
                    ))
                  ) : (
                    <Typography>No co-authors</Typography>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
