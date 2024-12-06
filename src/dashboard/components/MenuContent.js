import * as React from "react";
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
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import Cookies from "js-cookie";
import { Add } from "@mui/icons-material";

// faculty', 'student', 'researchScholar', 'committeeMember', 'competentAuthority

const typeOfUser = Cookies.get("userType") || "student";

const student = [
  { text: "Home", icon: <HomeRoundedIcon /> },
  { text: "My Submissions ", icon: <AnalyticsRoundedIcon /> },
  { text: "Peers", icon: <PeopleRoundedIcon /> },
  { text: "Eligibility and Awards", icon: <AssignmentRoundedIcon /> },
];

const faculty = student;
const researchScholar = student;

const committeeMember = [
  { text: "Home", icon: <HomeRoundedIcon /> },
  { text: "Approvals", icon: <AnalyticsRoundedIcon /> },
  { text: "Rejected", icon: <PeopleRoundedIcon /> },
  { text: "Pending List", icon: <AssignmentRoundedIcon /> },
];

const competentAuthority = [
  { text: "Home", icon: <HomeRoundedIcon /> },
  { text: "Approvals", icon: <AnalyticsRoundedIcon /> },
  { text: "Rejected", icon: <PeopleRoundedIcon /> },
  { text: "Pending List", icon: <AssignmentRoundedIcon /> },
  { text: "Add Committee Member", icon: <PeopleRoundedIcon /> },
];

const PrimaryListItems =
  typeOfUser === "student"
    ? student
    : typeOfUser === "faculty"
    ? faculty
    : typeOfUser === "researchScholar"
    ? researchScholar
    : typeOfUser === "committeeMember"
    ? committeeMember
    : competentAuthority;

const SecondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon /> },
  { text: "About", icon: <InfoRoundedIcon /> },
  { text: "Feedback", icon: <HelpRoundedIcon /> },
  { text: "Devloper's info ", icon: <PeopleRoundedIcon /> },
];

export default function MenuContent() {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {PrimaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton selected={index === 0}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List dense>
        {SecondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
