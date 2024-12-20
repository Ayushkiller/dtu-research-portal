import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SideMenu from "./SideMenu";
import CustomizedDataGrid from "./CustomizedDataGrid";
import ChartUserByDepartment from "./ChartUserByDepartment";
import MySubmissions from "./MySubmissions";

export default function MainGrid() {
  const [selectedMenu, setSelectedMenu] = React.useState("Home");

  const handleMenuSelect = (menuName) => {
    setSelectedMenu(menuName);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "Home":
        return (
          <Typography variant="h4" sx={{ p: 3 }}>
            Welcome Home
          </Typography>
        );
      case "My Submissions":
        return <MySubmissions />;
      case "Peers":
        return (
          <Typography variant="h4" sx={{ p: 3 }}>
            Peers Content
          </Typography>
        );
      case "Eligibility and Awards":
        return (
          <Typography variant="h4" sx={{ p: 3 }}>
            Eligibility and Awards Content
          </Typography>
        );
      case "Settings":
        return (
          <Typography variant="h4" sx={{ p: 3 }}>
            Settings Content
          </Typography>
        );
      default:
        return (
          <Typography variant="h4" sx={{ p: 3 }}>
            Select an option from the menu.
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideMenu onMenuSelect={handleMenuSelect} />
      <Box sx={{ flexGrow: 1, p: 3 }}>{renderContent()}</Box>
    </Box>
  );
}
