import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SelectContent from "./SelectContent";
import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const drawerWidth = 320;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // Ensures the Avatar stays at the bottom
  },
});

export default function SideMenu({ onMenuSelect }) {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const [name, setName] = useState("Default Name");
  const [email, setEmail] = useState("default@email.com");

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
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
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
        width: drawerWidth,
      }}
    >
      {/* Top Section */}
      <Box sx={{ display: "flex", mt: 2, p: 1.5 }}>
        <SelectContent />
      </Box>
      <Divider />

      {/* Main Menu */}
      <MenuContent onMenuSelect={onMenuSelect} />

      <Divider />

      {/* Next Meeting */}
      <Box
        sx={{
          p: 2,
          display: { xs: "block", md: "flex" },
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          Next Meeting:
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          3:00 PM, 21 Dec 2024
        </Typography>
      </Box>

      {/* User Info - Moved to the Bottom */}
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          alt={name}
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: "auto" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {email}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
