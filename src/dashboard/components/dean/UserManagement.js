import React from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Badge,
  Button,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import { UserTable } from "./UserTable";
import GroupIcon from "@mui/icons-material/Group";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

export const UserManagement = ({ usersData, setUsersData, columns, fetchUsers, searchText, setSearchText }) => {
  // Add a filter state
  const [activeFilter, setActiveFilter] = React.useState("all");
  
  // Calculate summary statistics for users
  const totalUsers = usersData.length;
  const facultyCount = usersData.filter(
    (user) => user.userType === "faculty"
  ).length;
  const committeeCount = usersData.filter(
    (user) => user.userType === "committeeMember"
  ).length;
  const bannedUsers = usersData.filter((user) => user.banned).length;

  // Filter users based on activeFilter and searchText
  const filteredUsers = React.useMemo(() => {
    // First filter by category
    let filtered = usersData;
    switch (activeFilter) {
      case "faculty":
        filtered = usersData.filter((user) => user.userType === "faculty");
        break;
      case "committee":
        filtered = usersData.filter((user) => user.userType === "committeeMember");
        break;
      case "banned":
        filtered = usersData.filter((user) => user.banned);
        break;
      case "all":
      default:
        filtered = usersData;
    }

    // Then filter by search text if it exists
    if (searchText && searchText.trim() !== '') {
      const lowerCaseSearch = searchText.toLowerCase();
      filtered = filtered.filter(user => 
        (user.name && user.name.toLowerCase().includes(lowerCaseSearch)) || 
        (user.email && user.email.toLowerCase().includes(lowerCaseSearch)) || 
        (user.department && user.department.toLowerCase().includes(lowerCaseSearch)) ||
        (user.employeeId && user.employeeId.toLowerCase().includes(lowerCaseSearch)) ||
        (user.userType && user.userType.toLowerCase().includes(lowerCaseSearch))
      );
    }

    return filtered;
  }, [usersData, activeFilter, searchText]);

  // Handle filter change when a card is clicked
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <GroupIcon sx={{ fontSize: 28, mr: 1, color: "#1976d2" }} />
          <Typography
            component="h2"
            variant="h5"
            sx={{ fontWeight: "medium", color: "#1976d2" }}
          >
            User Management
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            placeholder="Search users..."
            size="small"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {activeFilter !== "all" && (
            <Button 
              startIcon={<CloseIcon />} 
              variant="outlined" 
              size="small"
              onClick={() => setActiveFilter("all")}
            >
              Clear Filter
            </Button>
          )}
        </Box>
      </Box>

      {/* Summary Statistics Title */}
      <Typography variant="h6" gutterBottom sx={{ color: "#999", fontWeight: "bold" }}>
        User Statistics
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            onClick={() => handleFilterChange("all")}
            sx={{
              bgcolor: activeFilter === "all" ? "#e3f2fd" : "#f0f7ff",
              boxShadow: activeFilter === "all" ? "0 2px 12px rgba(25, 118, 210, 0.3)" : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "transform 0.3s ease-in-out, background-color 0.3s, box-shadow 0.3s",
              '&:hover': {
                transform: 'scale(1.05)',
                cursor: 'pointer',
              },
              border: activeFilter === "all" ? "1px solid #1976d2" : "none",
            }}
          >
            <CardContent
              sx={{
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Users
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "medium", mt: 0.5 }}
                >
                  {totalUsers}
                </Typography>
              </Box>
              <GroupIcon
                sx={{ fontSize: 40, color: "#1976d2", opacity: 0.8 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            onClick={() => handleFilterChange("faculty")}
            sx={{
              bgcolor: activeFilter === "faculty" ? "#ede7f6" : "#f5f5fd",
              boxShadow: activeFilter === "faculty" ? "0 2px 12px rgba(126, 87, 194, 0.3)" : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "transform 0.3s ease-in-out, background-color 0.3s, box-shadow 0.3s",
              '&:hover': {
                transform: 'scale(1.05)',
                cursor: 'pointer',
              },
              border: activeFilter === "faculty" ? "1px solid #7e57c2" : "none",
            }}
          >
            <CardContent
              sx={{
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Faculty
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "medium", mt: 0.5 }}
                >
                  {facultyCount}
                </Typography>
              </Box>
              <SchoolIcon
                sx={{ fontSize: 40, color: "#7e57c2", opacity: 0.8 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            onClick={() => handleFilterChange("committee")}
            sx={{
              bgcolor: activeFilter === "committee" ? "#e8f5e9" : "#f5fcf5",
              boxShadow: activeFilter === "committee" ? "0 2px 12px rgba(67, 160, 71, 0.3)" : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "transform 0.3s ease-in-out, background-color 0.3s, box-shadow 0.3s",
              '&:hover': {
                transform: 'scale(1.05)',
                cursor: 'pointer',
              },
              border: activeFilter === "committee" ? "1px solid #43a047" : "none",
            }}
          >
            <CardContent
              sx={{
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Commitee Members
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "medium", mt: 0.5 }}
                >
                  {committeeCount}
                </Typography>
              </Box>
              <PersonIcon
                sx={{ fontSize: 40, color: "#43a047", opacity: 0.8 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            onClick={() => handleFilterChange("banned")}
            sx={{
              bgcolor: activeFilter === "banned" ? "#ffebee" : "#fff5f5",
              boxShadow: activeFilter === "banned" ? "0 2px 12px rgba(229, 57, 53, 0.3)" : "0 2px 8px rgba(0,0,0,0.08)",
              transition: "transform 0.3s ease-in-out, background-color 0.3s, box-shadow 0.3s",
              '&:hover': {
                transform: 'scale(1.05)',
                cursor: 'pointer',
              },
              border: activeFilter === "banned" ? "1px solid #e53935" : "none",
            }}
          >
            <CardContent
              sx={{
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Banned Users
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "medium", mt: 0.5 }}
                >
                  {bannedUsers}
                </Typography>
              </Box>
              <Badge badgeContent={bannedUsers} color="error">
                <PeopleOutlineIcon
                  sx={{ fontSize: 40, color: "#e53935", opacity: 0.8 }}
                />
              </Badge>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {activeFilter !== "all" && (
        <Typography variant="subtitle1" sx={{ mb: 2, color: "#555" }}>
          Showing {filteredUsers.length} {activeFilter === "banned" ? "banned" : activeFilter} users
        </Typography>
      )}

      <UserTable 
        setUsersData={setUsersData}
        columns={columns}
        fetchUsers={fetchUsers}
        usersData={filteredUsers}
      />

    </Paper>
  );
};
