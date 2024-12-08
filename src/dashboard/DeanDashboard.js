import * as React from 'react';

import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
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
import DeanGrid from './components/DeanGrid';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function DeanDashboard(props) {
    const navigate = useNavigate();
    const token = Cookies.get("token");
    const [name, setName] = React.useState("Default Name");
    const [email, setEmail] = React.useState("default@email.com");
    
    React.useEffect(() => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if(decodedToken.userType !== "competentAuthority"){
            alert("You are not authorized to view this page");
            navigate("/signin");
          }
          setName(decodedToken.name);
          setEmail(decodedToken.email);
        } catch (error) {
          console.error("Error decoding token:", error);
          navigate("/signin");
        }
      } else {
        navigate("/signin");
      }
    }, [token, navigate]);
  
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
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
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <DeanGrid />
            {name}
            {email}

          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
