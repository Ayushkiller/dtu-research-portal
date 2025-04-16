import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Avatar,
  Link,
  Divider,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import CodeIcon from '@mui/icons-material/Code';

export default function DeveloperInfo() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const developers = [
    {
      name: "Ayush Kumar",
      role: "Full Stack Developer",
      image: "/path/to/avatar.jpg", // Add your image path
      github: "https://github.com/ayushkiller",
      linkedin: "https://linkedin.com/in/ayushkumar", // Added LinkedIn
      email: "malikayush999@gmail.com",
      bio: "Passionate about building scalable web applications with modern technologies."
    },
    {
      name: "Talha Ansari",
      role: "Full Stack Developer",
      image: "/path/to/avatar.jpg", // Add your image path
      github: "https://github.com/talha-ansarii",
      linkedin: "https://linkedin.com/in/talhaansari", // Added LinkedIn
      email: "talhaansari1606@gmail.com",
      bio: "Dedicated to creating elegant and efficient solutions for complex problems."
    }
  ];

  return (
    // Removed Container to fit within parent layout that has sidebar
    <Box sx={{ width: '100%', py: 4, px: 2 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Meet the Development Team
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
          The talented developers behind the DTU Research Portal
        </Typography>
      </Box>

      {/* Adjusted grid size to work better with sidebar layout */}
      <Grid container spacing={3} justifyContent="center">
        {developers.map((dev, index) => (
          <Grid item xs={12} sm={12} md={6} key={index}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                height: '100%',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: 4
                }
              }}
            >
              <Stack 
                direction={isTablet ? "column" : "row"}
                spacing={isTablet ? 2 : 3} 
                alignItems="center"
              >
                <Avatar
                  src={dev.image}
                  alt={dev.name}
                  sx={{ 
                    width: isTablet ? 100 : 120, 
                    height: isTablet ? 100 : 120,
                    border: `3px solid ${theme.palette.primary.main}`,
                    boxShadow: '0 3px 5px rgba(0,0,0,0.1)'
                  }}
                />
                <Box sx={{ textAlign: isTablet ? 'center' : 'left', flex: 1 }}>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {dev.name}
                  </Typography>
                  <Typography 
                    variant="subtitle2" 
                    color="primary.main" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isTablet ? 'center' : 'flex-start',
                      gap: 0.5
                    }}
                  >
                    <CodeIcon fontSize="small" />
                    {dev.role}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    paragraph 
                    sx={{ 
                      mb: 2,
                      // Limit text length to avoid oversized cards
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {dev.bio}
                  </Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  <Stack 
                    direction="row" 
                    spacing={1.5} 
                    justifyContent={isTablet ? 'center' : 'flex-start'}
                  >
                    <Link 
                      href={dev.github} 
                      target="_blank" 
                      aria-label="GitHub"
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': { color: 'primary.main' },
                        transition: 'color 0.2s ease'
                      }}
                    >
                      <GitHubIcon />
                    </Link>
                    <Link 
                      href={dev.linkedin} 
                      target="_blank" 
                      aria-label="LinkedIn"
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': { color: 'primary.main' },
                        transition: 'color 0.2s ease'
                      }}
                    >
                      <LinkedInIcon />
                    </Link>
                    <Link 
                      href={`mailto:${dev.email}`} 
                      aria-label="Email"
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': { color: 'primary.main' },
                        transition: 'color 0.2s ease'
                      }}
                    >
                      <EmailIcon />
                    </Link>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5
          }}
        >
          Built with React, Material-UI, and ❤️
        </Typography>

      </Box>
    </Box>
  );
}