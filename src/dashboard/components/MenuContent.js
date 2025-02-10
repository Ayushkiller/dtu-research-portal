import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function MenuContent() {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [me, setMe] = React.useState({});


        

  let typeOfUser = "";
  let userId = "";
  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.id;
    typeOfUser = decodedToken.userType;

  } else {
    alert("Session Expired. Please login again.");
    navigate("/signup");
  }

  const student = [
    { text: "Home", icon: <HomeRoundedIcon /> },
    { text: "My Submissions", icon: <AnalyticsRoundedIcon /> },
    { text: "Eligibility and Awards", icon: <AssignmentRoundedIcon /> },
  ];

  const committeeMember = [
    { text: "Home", icon: <HomeRoundedIcon /> },
    { text: "Approvals", icon: <AnalyticsRoundedIcon />, link: `/approvals/${userId}` },
    { text: "Rejected", icon: <PeopleRoundedIcon  />, link: `/rejected/${userId}` },
    { text: "Pending List", icon: <AssignmentRoundedIcon /> , link: `/pending/${userId}` },
  ];

  const competentAuthority = [
    { text: "Home", icon: <HomeRoundedIcon /> },
    { text: "Approvals", icon: <AnalyticsRoundedIcon /> },
    { text: "Rejected", icon: <PeopleRoundedIcon /> },
    { text: "Pending List", icon: <AssignmentRoundedIcon /> },
    { text: "Add Committee Member", icon: <PeopleRoundedIcon /> },
  ];

  const PrimaryListItems =
    typeOfUser === "student" ||
    typeOfUser === "faculty" ||
    typeOfUser === "researchScholar"
      ? student
      : typeOfUser === "committeeMember"
      ? committeeMember
      : competentAuthority;

  const SecondaryListItems = [
    { text: "Feedback", icon: <HelpRoundedIcon /> },
    { text: "Developer's Info", icon: <PeopleRoundedIcon /> },
  ];

  const handleListItemClick = (index, text) => {
    setSelectedIndex(index);
    if (text === "Eligibility and Awards") {
      window.dispatchEvent(new CustomEvent('menuClick', { detail: 'Eligibility and Awards' }));
    } else if (text === "Home") {
      window.dispatchEvent(new CustomEvent('menuClick', { detail: 'Home' }));
    } else if (text === "My Submissions") {
      window.dispatchEvent(new CustomEvent('menuClick', { detail: 'My Submissions' }));
    } else if (text === "Feedback") {
      window.dispatchEvent(new CustomEvent('menuClick', { detail: 'Feedback' }));
    } else if (text === "Developer's Info") {
      window.dispatchEvent(new CustomEvent('menuClick', { detail: "Developer's Info" }));
    }
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {PrimaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={selectedIndex === index}
              onClick={() => handleListItemClick(index, item.text)}

            >
              <ListItemIcon>{item.icon}</ListItemIcon>
            <a  style={{ textDecoration: "none" }} href={item.link}>
              <ListItemText primary={item.text} />
            </a>

            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List dense>
        {SecondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => handleListItemClick(PrimaryListItems.length + index, item.text)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}