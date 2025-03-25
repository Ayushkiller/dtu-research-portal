import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import Tooltip from "@mui/material/Tooltip";
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
    {
      text: "Approvals",
      icon: <AnalyticsRoundedIcon />,
      link: `/approvals/${userId}`,
    },
    {
      text: "Rejected",
      icon: <PeopleRoundedIcon />,
      link: `/rejected/${userId}`,
    },
    {
      text: "Pending List",
      icon: <AssignmentRoundedIcon />,
      link: `/pending/${userId}`,
    },
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
      window.dispatchEvent(
        new CustomEvent("menuClick", { detail: "Eligibility and Awards" })
      );
    } else if (text === "Home") {
      window.dispatchEvent(new CustomEvent("menuClick", { detail: "Home" }));
    } else if (text === "My Submissions") {
      window.dispatchEvent(
        new CustomEvent("menuClick", { detail: "My Submissions" })
      );
    } else if (text === "Approvals") {
      window.dispatchEvent(
        new CustomEvent("menuClick", { detail: "Approvals" })
      );
    } else if (text === "Rejected") {
      window.dispatchEvent(
        new CustomEvent("menuClick", { detail: "Rejected" })
      );
    } else if (text === "Pending List") {
      window.dispatchEvent(
        new CustomEvent("menuClick", { detail: "Pending List" })
      );
    } else if (text === "Add Committee Member") {
      window.dispatchEvent(
        new CustomEvent("menuClick", { detail: "Add Committee Member" })
      );
    } else if (text === "Feedback") {
      window.dispatchEvent(
        new CustomEvent("menuClick", { detail: "Feedback" })
      );
    } else if (text === "Developer's Info") {
      window.dispatchEvent(
        new CustomEvent("menuClick", { detail: "Developer's Info" })
      );
    }
  };

  return (
    <Stack
      sx={{
        flexGrow: 1,
        p: 1.5,
        justifyContent: "space-between",
        height: "100%",
        "& .MuiListItem-root": {
          transition: "all 0.2s ease",
        },
      }}
    >
      <List dense sx={{ width: "100%" }} role="listbox">
        {PrimaryListItems.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{ display: "block", mb: 0.8 }}
          >
            <Tooltip title={item.text} placement="right">
              <ListItemButton
                role="option"
                aria-selected={selectedIndex === index}
                selected={selectedIndex === index}
                onClick={() => handleListItemClick(index, item.text)}
                sx={{
                  borderRadius: 1.5,
                  py: 1,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    transform: "translateX(4px)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "primary.light",
                    borderLeft: "3px solid",
                    borderColor: "primary.main",
                    paddingLeft: "13px", // Compensate for the border
                    "&:hover": {
                      backgroundColor: "primary.light",
                    },
                  },
                  "&:focus-visible": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: "2px",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "36px",
                    color:
                      selectedIndex === index
                        ? "primary.main"
                        : "text.secondary",
                    "& .MuiSvgIcon-root": {
                      fontSize: "1.2rem",
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {item.link ? (
                  <a
                    href={item.link}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: selectedIndex === index ? "500" : "400",
                        letterSpacing: "0.01em",
                      }}
                    />
                    <Box
                      component="span"
                      sx={{ ml: "auto", fontSize: "1rem", opacity: 0.7 }}
                    >
                      →
                    </Box>
                  </a>
                ) : (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: selectedIndex === index ? "500" : "400",
                      letterSpacing: "0.01em",
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <div>
        <Divider sx={{ my: 2, opacity: 0.6 }} />
        <List dense sx={{ width: "100%" }}>
          {SecondaryListItems.map((item, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{ display: "block", mb: 0.8 }}
            >
              <Tooltip title={item.text} placement="right">
                <ListItemButton
                  role="option"
                  aria-selected={
                    selectedIndex === PrimaryListItems.length + index
                  }
                  onClick={() =>
                    handleListItemClick(
                      PrimaryListItems.length + index,
                      item.text
                    )
                  }
                  selected={selectedIndex === PrimaryListItems.length + index}
                  sx={{
                    borderRadius: 1.5,
                    py: 1,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      transform: "translateX(4px)",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "primary.light",
                      borderLeft: "3px solid",
                      borderColor: "primary.main",
                      paddingLeft: "13px", // Compensate for the border
                      "&:hover": {
                        backgroundColor: "primary.light",
                      },
                    },
                    "&:focus-visible": {
                      outline: "2px solid",
                      outlineColor: "primary.main",
                      outlineOffset: "2px",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: "36px",
                      color:
                        selectedIndex === PrimaryListItems.length + index
                          ? "primary.main"
                          : "text.secondary",
                      "& .MuiSvgIcon-root": {
                        fontSize: "1.2rem",
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight:
                        selectedIndex === PrimaryListItems.length + index
                          ? "500"
                          : "400",
                      letterSpacing: "0.01em",
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </div>
    </Stack>
  );
}
