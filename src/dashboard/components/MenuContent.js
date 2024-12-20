import React from "react";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function MenuContent({ onMenuSelect }) {
  const navigate = useNavigate();
  const token = Cookies.get("token");

  React.useEffect(() => {
    if (!token) {
      alert("Session Expired. Please login again.");
      navigate("/signup");
    }
  }, [token, navigate]);

  const typeOfUser = token ? jwtDecode(token)?.userType : "";

  const menuItems = {
    student: [
      { text: "Home", icon: <HomeRoundedIcon /> },
      { text: "My Submissions", icon: <AnalyticsRoundedIcon /> },
      { text: "Peers", icon: <PeopleRoundedIcon /> },
      { text: "Eligibility and Awards", icon: <AssignmentRoundedIcon /> },
    ],
    committeeMember: [
      { text: "Home", icon: <HomeRoundedIcon /> },
      { text: "Approvals", icon: <AnalyticsRoundedIcon /> },
      { text: "Rejected", icon: <PeopleRoundedIcon /> },
      { text: "Pending List", icon: <AssignmentRoundedIcon /> },
    ],
    competentAuthority: [
      { text: "Home", icon: <HomeRoundedIcon /> },
      { text: "Approvals", icon: <AnalyticsRoundedIcon /> },
      { text: "Rejected", icon: <PeopleRoundedIcon /> },
      { text: "Pending List", icon: <AssignmentRoundedIcon /> },
      { text: "Add Committee Member", icon: <PeopleRoundedIcon /> },
    ],
  };

  const PrimaryListItems = menuItems[typeOfUser] || menuItems.student; // Default to 'student' menu if no valid type is found

  const SecondaryListItems = [
    { text: "Settings", icon: <SettingsRoundedIcon /> },
    { text: "About", icon: <InfoRoundedIcon /> },
    { text: "Feedback", icon: <HelpRoundedIcon /> },
    { text: "Developer's Info", icon: <PeopleRoundedIcon /> },
  ];

  return (
    <div>
      {/* Primary Menu */}
      <List dense>
        {PrimaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={() => onMenuSelect(item.text)}
              selected={index === 0}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Divider */}
      <List dense>
        {SecondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => onMenuSelect(item.text)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
