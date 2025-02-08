import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Avatar,
  Link,
  Divider,
  Grid
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

export default function DeveloperInfo() {
  const developers = [
    {
      name: "Ayush Kumar",
      role: "Full Stack Developer",
      image: "/path/to/avatar.jpg", // Add your image path
      github: "https://github.com/ayushkiller",
      email: "malikayush999@gmail.com",
    }
    // Add your name talha
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Meet the Development Team
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {developers.map((dev, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Stack spacing={2} alignItems="center">
                <Avatar
                  src={dev.image}
                  alt={dev.name}
                  sx={{ width: 120, height: 120 }}
                />
                <Typography variant="h6" component="h2">
                  {dev.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {dev.role}
                </Typography>
                <Divider flexItem />
                <Stack direction="row" spacing={2}>
                  <Link href={dev.github} target="_blank" color="inherit">
                    <GitHubIcon />
                  </Link>
                  <Link href={dev.linkedin} target="_blank" color="inherit">
                    <LinkedInIcon />
                  </Link>
                  <Link href={`mailto:${dev.email}`} color="inherit">
                    <EmailIcon />
                  </Link>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Built with React, Material-UI, and ❤️
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          © {new Date().getFullYear()} DTU Research Portal
        </Typography>
      </Box>
    </Box>
  );
}
