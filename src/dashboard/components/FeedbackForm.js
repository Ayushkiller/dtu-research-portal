import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Rating,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import API from '../../api/axios';

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/feedback', feedback);
      setSnackbar({
        open: true,
        message: 'Feedback submitted successfully!',
        severity: 'success'
      });
      setFeedback({ rating: 0, comment: '' });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to submit feedback. Please try again.',
        severity: 'error'
      });
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Provide Your Feedback
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box>
              <Typography component="legend">Rate your experience</Typography>
              <Rating
                name="rating"
                value={feedback.rating}
                onChange={(_, value) => setFeedback(prev => ({ ...prev, rating: value }))}
                size="large"
              />
            </Box>
            <TextField
              label="Your Comments"
              multiline
              rows={4}
              value={feedback.comment}
              onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
              fullWidth
              required
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={!feedback.rating || !feedback.comment}
            >
              Submit Feedback
            </Button>
          </Stack>
        </form>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
