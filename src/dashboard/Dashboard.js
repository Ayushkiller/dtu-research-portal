import * as React from 'react';

import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import MainGrid from './components/MainGrid';
import SideMenu from './components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
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
  React.useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if(decodedToken.userType === "competentAuthority" || decodedToken.userType === "committeeMember"){
          alert("You are not authorized to view this page");

          if(decodedToken.userType === "competentAuthority"){
            navigate("/dean-dashboard");
          } else {
            // navigate("/committee-dashboard");
          }
          
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/signin");
      }
    } else {
      navigate("/signin");
    }
  }, [navigate,token]);
  
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          })}
        >
          <Stack
            spacing={3}
            sx={{
              alignItems: 'center',
              mx: { xs: 2, sm: 3, md: 4 },
              py: { xs: 2, sm: 3 },
              px: { xs: 1, sm: 2 },
              pb: 5,
              mt: { xs: 10, md: 12 },
              width: '100%',
              maxWidth: '1200px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <Header />
            <MainGrid />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
