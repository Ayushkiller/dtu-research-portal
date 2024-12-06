import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  TextField
} from '@mui/material';

export const AddAuthorModal = ({ open, onClose, onSubmit }) => {
  const [authorType, setAuthorType] = useState('internal');
  const [authorName, setAuthorName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  
  // Bank details state (only used if external)
  const [bankName, setBankName] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  const handleSubmit = () => {
    const authorData = {
      name: authorName,
      email,
      mobileNo,
      isExternal: authorType === 'external',
      ...(authorType === 'external' && {
        bankDetails: {
          bankName,
          branch: bankBranch,
          accountNo,
          ifscCode
        }
      })
    };

    onSubmit(authorData);
    resetForm();
  };

  const resetForm = () => {
    setAuthorType('internal');
    setAuthorName('');
    setEmail('');
    setMobileNo('');
    setBankName('');
    setBankBranch('');
    setAccountNo('');
    setIfscCode('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Author</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset" fullWidth sx={{ mt: 2, mb: 2 }}>
          <FormLabel component="legend">Author Type</FormLabel>
          <RadioGroup 
            row 
            value={authorType} 
            onChange={(e) => setAuthorType(e.target.value)}
          >
            <FormControlLabel 
              value="internal" 
              control={<Radio />} 
              label="Internal (University)" 
            />
            <FormControlLabel 
              value="external" 
              control={<Radio />} 
              label="External" 
            />
          </RadioGroup>
        </FormControl>

        <TextField
          fullWidth
          label="Author Name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          sx={{ mb: 2 }}
          required
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
          required
        />

        <TextField
          fullWidth
          label="Mobile Number"
          type="tel"
          value={mobileNo}
          onChange={(e) => setMobileNo(e.target.value)}
          sx={{ mb: 2 }}
          required
        />

        {authorType === 'external' && (
          <>
            <TextField
              fullWidth
              label="Bank Name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Bank Branch"
              value={bankBranch}
              onChange={(e) => setBankBranch(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="Account Number"
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="IFSC Code"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={!authorName || !email || !mobileNo}
        >
          Add Author
        </Button>
      </DialogActions>
    </Dialog>
  );
};