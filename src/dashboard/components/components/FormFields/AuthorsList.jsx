import React from "react";
import { 
  Grid, 
  Box, 
  Typography, 
  Chip, 
  Tooltip, 
  Button 
} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BankIcon from '@mui/icons-material/AccountBalance';

export default function AuthorsList({ 
  authors = [], 
  editable = false, 
  onEditAuthor, 
  onRemoveAuthor 
}) {
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
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {authors.map((author, index) => (
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
              }
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
                      <strong>Share Amount:</strong> ₹{author.amount !== undefined && author.amount !== null ? author.amount.toLocaleString() : 'N/A'}
                    </Typography>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>

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
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="small"
                    onClick={() => onEditAuthor(index)}
                  >
                    Edit
                  </Button>
                </Tooltip>
                <Tooltip title="Remove Author">
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small"
                    onClick={() => onRemoveAuthor(index)}
                  >
                    Remove
                  </Button>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}