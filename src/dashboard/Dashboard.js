import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import MainGrid from './components/MainGrid';
import SideMenu from './components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Fade } from '@mui/material';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props) {
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if(decodedToken.userType === "competentAuthority" || decodedToken.userType === "committeeMember"){
          alert("You are not authorized to view this page");
          
          if(decodedToken.userType === "competentAuthority"){
            navigate("/dean-dashboard");
          } else {
            navigate("/committee-dashboard");
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/signin");
      }
    } else {
      navigate("/signin");
    }
  }, [navigate, token]);
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        width: '100vw'
      }}>
        {/* Add your loading spinner component here */}
      </Box>
    );
  }
  
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ 
        display: 'flex', 
        height: '100vh', 
        width: '100vw', 
        overflow: 'hidden',
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#121212' : '#f5f5f5',
      }}>
        <SideMenu />
        <Fade in={!loading} timeout={800}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              flexGrow: 1, 
              width: '100%',
              overflow: 'hidden',
              position: 'relative',
              transition: 'all 0.3s ease',
            }}
          >
            <AppNavbar elevation={0} />
            {/* Main content */}
            <Box
              component="main"
              sx={(theme) => ({
                flexGrow: 1,
                backgroundColor: theme.vars
                  ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.98)`
                  : alpha(theme.palette.background.default, 0.98),
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
                pt: { xs: 2, sm: 3 },
                pb: { xs: 3, sm: 4 },
                transition: 'all 0.3s ease',
              })}
            >
              <Container 
                maxWidth="xl" 
                disableGutters
                sx={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  px: { xs: 2, sm: 3, md: 4 },
                }}
              >
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    borderRadius: 2,
                    bgcolor: (theme) => theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.background.paper, 0.8) 
                      : theme.palette.background.paper,
                  }}
                >
                  <Header />
                </Paper>
                <Box sx={{ 
                  flexGrow: 1, 
                  width: '100%',
                  display: 'flex',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: (theme) => theme.palette.mode === 'dark' 
                    ? '0 4px 20px 0 rgba(0,0,0,0.2)' 
                    : '0 4px 20px 0 rgba(0,0,0,0.05)',
                }}>
                  <MainGrid />
                </Box>
              </Container>
            </Box>
          </Box>
        </Fade>
      </Box>
    </AppTheme>
  );
}
