import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  InputLabel,
} from "@mui/material";

const AuthorDialog = ({
  open,
  onClose,
  currentAuthor,
  handleAuthorChange,
  saveAuthor,
  editingAuthorIndex,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingAuthorIndex !== null ? "Edit Author" : "Add New Author"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <InputLabel>Author Name</InputLabel>
            <TextField
              fullWidth
              name="name"
              value={currentAuthor.name}
              onChange={handleAuthorChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel>Email</InputLabel>
            <TextField
              fullWidth
              name="email"
              type="email"
              value={currentAuthor.email}
              onChange={handleAuthorChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={currentAuthor.isExternal}
                  onChange={handleAuthorChange}
                  name="isExternal"
                />
              }
              label="External Author"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel>Bank Name</InputLabel>
            <TextField
              fullWidth
              name="bankDetails.bankName"
              value={currentAuthor.bankDetails.bankName}
              onChange={handleAuthorChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel>Branch</InputLabel>
            <TextField
              fullWidth
              name="bankDetails.branch"
              value={currentAuthor.bankDetails.branch}
              onChange={handleAuthorChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel>Account Number</InputLabel>
            <TextField
              fullWidth
              name="bankDetails.accountNo"
              value={currentAuthor.bankDetails.accountNo}
              onChange={handleAuthorChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel>IFSC Code</InputLabel>
            <TextField
              fullWidth
              name="bankDetails.ifscCode"
              value={currentAuthor.bankDetails.ifscCode}
              onChange={handleAuthorChange}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={saveAuthor} color="primary" variant="contained">
          Save Author
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthorDialog;
