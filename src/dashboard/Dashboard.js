import * as React from "react";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import MainGrid from "./components/MainGrid";
import SideMenu from "./components/SideMenu";
import AppTheme from "../shared-theme/AppTheme";
import Cookies from "js-cookie";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Dashboard(props) {
  const [selectedMenu, setSelectedMenu] = React.useState("dashboard");

  const token = Cookies.get("token");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        if (
          ["competentAuthority", "committeeMember"].includes(
            decodedToken.userType
          )
        ) {
          alert("You are not authorized to view this page");

          navigate(
            decodedToken.userType === "competentAuthority"
              ? "/dean-dashboard"
              : "/committee-dashboard"
          );
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/signin");
      }
    } else {
      navigate("/signin");
    }
  }, [navigate, token]);

  const renderContent = () => {
    switch (selectedMenu) {
      case "dashboard":
        return (
          <>
            <Header />
            <MainGrid />
          </>
        );
      case "profile":
        return <Typography variant="h5">Profile Section</Typography>;
      case "settings":
        return <Typography variant="h5">Settings Section</Typography>;
      default:
        return <Typography variant="h5">Select a Menu Option</Typography>;
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu onMenuSelect={setSelectedMenu} />
        <AppNavbar onMenuSelect={setSelectedMenu} />

        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            {renderContent()}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
