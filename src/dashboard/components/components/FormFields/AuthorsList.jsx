import React, { useState } from "react";
import { 
  Grid, 
  Box, 
  Typography, 
  Chip, 
  Tooltip, 
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Slider,
  Alert,
  LinearProgress,
  Divider,
  IconButton
} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BankIcon from '@mui/icons-material/AccountBalance';
import PercentIcon from '@mui/icons-material/Percent';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AuthorsList({ 
  authors = [], 
  editable = false, 
  onEditAuthor, 
  onRemoveAuthor,
  totalAwardAmount = 0,
  onUpdateShareValues = null,
  calculatedShares = []
}) {
  const [manualMode, setManualMode] = useState(false);
  const [shareValues, setShareValues] = useState(() => 
    authors.map(author => ({
      id: author.email,
      value: author.shareValue || 0,
      amount: author.amount || 0,
      minValue: author.calculatedMinShare || 0
    }))
  );
  
  // Update local state when authors prop changes
  React.useEffect(() => {
    setShareValues(authors.map(author => ({
      id: author.email,
      value: author.shareValue || 0,
      amount: author.amount || 0,
      minValue: author.calculatedMinShare || 0
    })));
  }, [authors]);
  
  // Calculate total percentage to ensure it stays at 100%
  const totalPercentage = shareValues.reduce((sum, share) => sum + share.value, 0);
  
  const handleShareChange = (index, newValue) => {
    // Get the author's minimum share value
    const minShareValue = authors[index].calculatedMinShare || 0;
    
    // Ensure the new value is not less than the minimum
    let validatedValue = Math.max(newValue, minShareValue);

    // Calculate sum of other authors' shares
    const sumOfOthers = shareValues
      .filter((_, i) => i !== index)
      .reduce((sum, share) => sum + share.value, 0);

    // Cap validatedValue so total doesn't exceed 100%
    const maxAllowed = 100 - sumOfOthers;
    validatedValue = Math.min(validatedValue, maxAllowed);

    const newShareValues = [...shareValues];
    newShareValues[index].value = validatedValue;
    
    // Recalculate amounts based on percentages
    newShareValues.forEach(share => {
      share.amount = (share.value / 100) * totalAwardAmount;
    });
    
    setShareValues(newShareValues);
    
    // Notify parent component of the change
    if (onUpdateShareValues) {
      const updatedAuthors = authors.map((author, idx) => ({
        ...author,
        shareValue: newShareValues[idx].value,
        amount: newShareValues[idx].amount
      }));
      onUpdateShareValues(updatedAuthors);
    }
  };
  
  if (authors.length === 0) {
    return (
      <Box 
        sx={{ 
          textAlign: 'center', 
          p: 4, 
          bgcolor: 'background.paper', 
          borderRadius: 2 
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No authors added yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {editable && totalAwardAmount > 0 && (
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={manualMode}
                onChange={(e) => setManualMode(e.target.checked)}
                color="primary"
              />
            }
            label="Manually adjust share values"
          />
          
          {manualMode && (
            <Alert severity="info" sx={{ mt: 1 }}>
              Adjust the share percentages manually. Values cannot be lower than the calculated minimum shares.
              Total: {totalPercentage.toFixed(2)}% / 100%
            </Alert>
          )}
          
          {manualMode && Math.abs(totalPercentage - 100) > 0.01 && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Total share percentages must equal 100%. Current total: {totalPercentage.toFixed(2)}%
            </Alert>
          )}
        </Box>
      )}

      <Grid container spacing={2}>
        {authors.map((author, index) => {
          const sharePercentage = author.shareValue || 0;
          const shareAmount = author.amount || 0;
          
          return (
            <Grid item xs={12} key={index}>
              <Box
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  mb: 1,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-4px)'
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <AccountCircleIcon color="primary" />
                      <Typography variant="subtitle1">
                        <strong>Name:</strong> {author.name}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <EmailIcon color="primary" />
                      <Typography variant="subtitle1">
                        <strong>Email:</strong> {author.email}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <WorkIcon color="primary" />
                      <Chip 
                        label={author.isExternal ? "External" : "Internal"} 
                        color={author.isExternal ? "warning" : "success"}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <BankIcon color="primary" />
                      <Typography variant="subtitle1">
                        <strong>Bank:</strong> {author.bankDetails.bankName}, {author.bankDetails.branch}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <AttachMoneyIcon color="primary" />
                      <Tooltip title="Calculated Share Amount" placement="top">
                        <Typography variant="subtitle1" color="primary">
                          <strong>Share Amount:</strong> ₹{shareAmount !== undefined ? shareAmount.toLocaleString(undefined, {maximumFractionDigits: 2}) : 'N/A'}
                        </Typography>
                      </Tooltip>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PercentIcon color="primary" />
                      <Typography variant="subtitle1">
                        <strong>Share:</strong> {sharePercentage.toFixed(2)}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                {manualMode && editable && (
                  <Box sx={{ mt: 2, px: 2 }}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" gutterBottom>
                      Adjust share percentage (min: {author.calculatedMinShare?.toFixed(2) || '0.00'}%)
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Slider
                        value={shareValues[index]?.value || 0}
                        min={author.calculatedMinShare || 0}
                        max={100}
                        step={0.1}
                        onChange={(_, newValue) => handleShareChange(index, newValue)}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value.toFixed(1)}%`}
                        sx={{ flexGrow: 1 }}
                      />
                      <TextField
                        value={shareValues[index]?.value.toFixed(2) || 0}
                        onChange={(e) => {
                          const newValue = parseFloat(e.target.value);
                          if (!isNaN(newValue)) {
                            handleShareChange(index, newValue);
                          }
                        }}
                        InputProps={{
                          endAdornment: <PercentIcon fontSize="small" />,
                        }}
                        type="number"
                        inputProps={{
                          min: author.calculatedMinShare || 0,
                          max: 100,
                          step: 0.1
                        }}
                        sx={{ width: 120 }}
                        size="small"
                      />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min((shareValues[index]?.value || 0), 100)} 
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                  </Box>
                )}

                {editable && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10, 
                      display: 'flex', 
                      gap: 1 
                    }}
                  >
                    <Tooltip title="Edit Author">
                      <IconButton
                        color="primary"
                        onClick={() => onEditAuthor(index)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove Author">
                      <IconButton
                        color="error"
                        onClick={() => onRemoveAuthor(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}