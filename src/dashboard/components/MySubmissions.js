import * as React from 'react';
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
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import API from '../../api/axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export default function MySubmissions() {
  const [submissions, setSubmissions] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          setError('No token found');
          return;
        }
        
        const decodedToken = jwtDecode(token);
        if (!decodedToken.email) {
          setError('No email in token');
          return;
        }

        console.log('Fetching submissions for:', decodedToken.email); // Debug log

        const response = await API.get(`/research-paper-fetch/user/${decodedToken.email}`);
        console.log('Submissions response:', response.data); // Debug log
        setSubmissions(response.data);
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
        setError(error.message);
      }
    };

    fetchSubmissions();
  }, []);

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'authorshipConfirmationPending':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Add error display
  if (error) {
    return (
      <Box sx={{ width: '100%', p: 3 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
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
                  {submission.paperDetails[Object.keys(submission.paperDetails)[0]]?.answer || 'Untitled'}
                </TableCell>
                <TableCell>{formatDate(submission.createdAt)}</TableCell>
                <TableCell>
                  <Chip
                    label={submission.status}
                    color={getStatusChipColor(submission.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{submission.comments || '-'}</TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton>
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
    </Box>
  );
}
