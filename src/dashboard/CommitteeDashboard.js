import * as React from "react";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import AppTheme from "../shared-theme/AppTheme";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";
import CommitteeGrid from "./components/CommitteeGrid";
import CommitteePending from "./components/CommitteePending";
import CommitteeApprovals from "./components/CommitteeApprovals";
import CommitteeRejected from "./components/CommitteeRejected";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function CommitteeDashboard(props) {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const [name, setName] = React.useState("Default Name");
  const [email, setEmail] = React.useState("default@email.com");
  const [activeView, setActiveView] = React.useState("dashboard");
  const [userId, setUserId] = React.useState("");
  // Listen for menu click events to change the active view
  React.useEffect(() => {
    const handleMenuClick = (event) => {
      if (event.detail === "Approvals") {
        setActiveView("approvals");
      } else if (event.detail === "Rejected") {
        setActiveView("rejected");
      } else if (event.detail === "Pending List") {
        setActiveView("pending");
      } else if (event.detail === "Home") {
        setActiveView("dashboard");
      } else {
        // Other menu options might be handled here
      }
    };

    window.addEventListener("menuClick", handleMenuClick);

    return () => {
      window.removeEventListener("menuClick", handleMenuClick);
    };
  }, []);

  React.useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.userType !== "committeeMember") {
          alert("You are not authorized to view this page");
          navigate("/signin");
        }
        setName(decodedToken.name);
        setEmail(decodedToken.email);
        setUserId(decodedToken.id)
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/signin");
      }
    } else {
      navigate("/signin");
    }
  }, [token, navigate]);

  // Render content based on active view
  const renderContent = () => {
    switch (activeView) {
      case "approvals":
        return (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{ mb: 2, fontWeight: "medium" }}
            >
              Approved Research Papers
            </Typography>
            <CommitteeApprovals />
          </Paper>
        );
      case "rejected":
        return (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{ mb: 2, fontWeight: "medium" }}
            >
              Rejected Research Papers
            </Typography>
            <CommitteeRejected userId={userId} />
          </Paper>
        );
      case "pending":
        return (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{ mb: 2, fontWeight: "medium" }}
            >
              Pending Research Papers
            </Typography>
            <CommitteePending userId={userId} />
          </Paper>
        );
      default:
        return (
          <Grid container spacing={3}>
            {/* All Research Papers Section */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mb: 2, fontWeight: "medium" }}
                >
                  All Research Papers
                </Typography>
                <CommitteeGrid />
              </Paper>
            </Grid>

            {/* Pending Papers Preview Section */}
            
          </Grid>
        );
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
            p: { xs: 2, md: 3 },
          })}
        >
          <Stack spacing={3}>
            <Header />

            {/* Dashboard Overview */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: (theme) =>
                  `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "medium", color: "primary.main" }}
              >
                Committee Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome back, {name}! Manage research papers and approvals.
              </Typography>
            </Paper>

            {/* Render the appropriate content based on active view */}
            {renderContent()}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
