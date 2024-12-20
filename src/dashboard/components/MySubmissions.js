import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Cookies from "js-cookie";
import API from "../../api/axios"; // Adjust this path based on your project structure
import { jwtDecode } from "jwt-decode";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
  boxShadow: theme.shadows[4],
  margin: theme.spacing(2, 0),
  "&:hover": {
    boxShadow: theme.shadows[8],
  },
}));

const SubmissionsContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(4),
  minHeight: "100vh",
  backgroundColor: theme.palette.mode === "dark" ? "#101010" : "#f5f5f5",
}));

export default function MySubmission() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = Cookies.get("token");
        const decodedToken = jwtDecode(token);
        const userID = decodedToken.id;
        const response = await API.get(`/submissions/${userID}`); // Adjust API endpoint
        setSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };
    fetchSubmissions();
  }, []);

  return (
    <SubmissionsContainer spacing={3}>
      <Typography variant="h4" align="center">
        My Research Papers
      </Typography>
      {submissions.length ? (
        submissions.map((submission) => (
          <StyledCard key={submission.id} variant="outlined">
            <CardContent>
              <Typography variant="h6">{submission.title}</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Submitted on: {new Date(submission.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" paragraph>
                {submission.abstract}
              </Typography>
              <Button
                href={`/submissions/${submission.id}`}
                variant="outlined"
                color="primary"
              >
                View Details
              </Button>
            </CardContent>
          </StyledCard>
        ))
      ) : (
        <Typography align="center">No submissions found.</Typography>
      )}
    </SubmissionsContainer>
  );
}
