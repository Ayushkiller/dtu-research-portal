import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

export default function ResearchPaperSubmissionForm({ open, onClose }) {

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Submit Research Paper</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Title" variant="outlined" fullWidth required />
          <TextField label="Authors" variant="outlined" fullWidth required />
          <TextField label="Journal Name" variant="outlined" fullWidth required />
          <TextField label="Year" variant="outlined" fullWidth required />
          <TextField label="Google Drive Link" variant="outlined" fullWidth required />
          {/* Add more fields as needed */}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button type="submit" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}