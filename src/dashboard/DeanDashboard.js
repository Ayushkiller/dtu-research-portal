import * as React from "react";

import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import AppTheme from "../shared-theme/AppTheme";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";
import DeanGrid from "./components/dean/DeanGrid";
import Approvals from "./components/dean/Approvals";
import Rejected from "./components/dean/Rejected";
import Pending from "./components/dean/Pending";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function DeanDashboard(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = Cookies.get("token");
  const [name, setName] = React.useState("Default Name");
  const [email, setEmail] = React.useState("default@email.com");
  const [activeView, setActiveView] = React.useState("dashboard");

  // Listen for menu click events to change the active view
  React.useEffect(() => {
    const handleMenuClick = (event) => {
      if (event.detail === "Approvals") {
        setActiveView("approvals");
      } else if (event.detail === "Rejected") {
        setActiveView("rejected");
      } else if (event.detail === "Pending List") {
        setActiveView("pending");
      } else {
        setActiveView("dashboard");
      }
    };

    window.addEventListener("menuClick", handleMenuClick);

    return () => {
      window.removeEventListener("menuClick", handleMenuClick);
    };
  }, []);

  // Check if the URL contains specific paths and set the active view accordingly
  React.useEffect(() => {
    if (location.pathname.includes("approvals")) {
      setActiveView("approvals");
    } else if (location.pathname.includes("rejected")) {
      setActiveView("rejected");
    } else if (location.pathname.includes("pending")) {
      setActiveView("pending");
    } else {
      setActiveView("dashboard");
    }
  }, [location]);

  React.useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.userType !== "competentAuthority") {
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
  }, [token, navigate, setName, setEmail]);

  // Render component based on active view
  const renderContent = () => {
    switch (activeView) {
      case "approvals":
        return <Approvals />;
      case "rejected":
        return <Rejected />;
      case "pending":
        return <Pending />;
      default:
        return <DeanGrid />;
    }
  };

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
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
            <Header />
            {renderContent()}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
