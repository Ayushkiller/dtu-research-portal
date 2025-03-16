import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Button, Typography, Divider, List, ListItem, ListItemIcon, ListItemText, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function SubmissionButton({ onShowForm }) {
  const theme = useTheme();

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        width: '100%',
        borderRadius: theme.shape.borderRadius,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography 
          component="h2" 
          variant="h5" 
          gutterBottom
          sx={{ 
            fontWeight: 'medium',
            mb: 2,
            color: theme.palette.primary.main
          }}
        >
          Research Paper Submission
        </Typography>
        
        {/* Description */}
        <Typography variant="body1" sx={{ marginBottom: 2, color: 'text.secondary' }}>
          Submit your research papers for review and awards distribution. Ensure compliance with DTU's research submission policies.
        </Typography>

        <Divider sx={{ marginY: 2 }} />

        {/* Guidelines */}
        <Typography component="h3" variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
          Submission Guidelines
        </Typography>
        <List dense sx={{ mb: 2 }}>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="All papers must be peer-reviewed and published in a recognized journal." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Ensure the journal's indexing and impact factor are mentioned." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Provide accurate author details, including corresponding author's bank information." />
          </ListItem>
        </List>

        <Divider sx={{ marginY: 2 }} />

        {/* Eligibility */}
        <Typography component="h3" variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
          Eligibility Criteria
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 2, color: 'text.secondary' }}>
          - Only DTU students and faculty can submit research papers.<br />
          - Papers must be published within the last academic year.<br />
          - Ensure the total award share values adhere to policy limits.
        </Typography>

        <Divider sx={{ marginY: 2 }} />

        {/* Submission Call-to-Action */}
        <Typography component="h3" variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
          Next Steps
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 3, color: 'text.secondary' }}>
          Click the button below to access the research paper submission form. Ensure all required fields are filled out correctly before submission.
        </Typography>
        <Stack direction="row" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={onShowForm}
            sx={{
              textTransform: 'none',
              padding: theme.spacing(1.5, 3),
              fontSize: theme.typography.pxToRem(16),
              borderRadius: theme.shape.borderRadius,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
              }
            }}
          >
            Submit Research Paper
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}