import {
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  Typography,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import API from "../../../api/axios";

export const UserTable = ({ usersData, setUsersData, columns, fetchUsers }) => {
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [selectedRules, setSelectedRules] = React.useState([]);

  // Available rules for committee members
  const availableRules = [
    "canReviewPaper",
    "canRejectPaper",
    "canApprovePaper",
    'canSuspendPaper',
  ];

  // Fetch users data from backend
  React.useEffect(() => {
    fetchUsers();
    console.log("Users data fetched successfully.", selectedUser);
  }, [selectedUser]);

  // Set selected rules when a user is selected
  React.useEffect(() => {
    if (selectedUser && selectedUser?.rules) {
      setSelectedRules(selectedUser?.rules);
    } else {
      setSelectedRules([]);
    }
  }, [selectedUser]);

  const handleRowClick = (params) => {
    setSelectedUser(params.row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
    setSelectedRules([]);
  };

  const handleBanUser = async () => {
    if (selectedUser) {
      try {
        await API.put(`/dean/accounts/ban/${selectedUser.id}`);
        fetchUsers();
        setOpenModal(false);
        alert(`${selectedUser.name} banned successfully.`);
      } catch (error) {
        console.error("Error banning user:", error);
      }
    }
  };

  const handleUnbanUser = async () => {
    if (selectedUser) {
      try {
        await API.put(`/dean/accounts/unban/${selectedUser.id}`);
        setUsersData((prev) =>
          prev.map((user) =>
            user.id === selectedUser.id ? { ...user, isBanned: false } : user
          )
        );
        fetchUsers();
        setOpenModal(false);
        alert(`${selectedUser.name} unbanned successfully.`);
      } catch (error) {
        console.error("Error unbanning user:", error);
      }
    }
  };

  const handlePromoteUser = async () => {
    if (selectedUser) {
      try {
        await API.put(`/dean/accounts/promote/${selectedUser.id}`);
        fetchUsers();
        setOpenModal(false);
        alert(
          `${selectedUser.name} promoted to committee member successfully.`
        );
      } catch (error) {
        console.error("Error promoting user:", error);
        alert("Failed to promote user. Please try again.");
      }
    }
  };

  const handleDemoteUser = async () => {
    if (selectedUser) {
      try {
        await API.put(`/dean/accounts/demote/${selectedUser.id}`);
        fetchUsers();
        setOpenModal(false);
        alert(
          `${selectedUser.name} demoted from committee member successfully.`
        );
      } catch (error) {
        console.error("Error demoting user:", error);
        alert("Failed to demote user. Please try again.");
      }
    }
  };

  // Handle rule changes
  const handleRuleChange = (event) => {
    setSelectedRules(event.target.value);
  };

  // Save the updated rules
  const handleSaveRules = async () => {
    if (selectedUser) {
      try {
        await API.put(`/dean/accounts/rules/${selectedUser.id}`, {
          rules: selectedRules
        });
        
        // Update local state
        setUsersData((prev) =>
          prev.map((user) =>
            user.id === selectedUser.id ? { ...user, rules: selectedRules } : user
          )
        );
        
        alert("Permissions updated successfully.");
        fetchUsers();
      } catch (error) {
        console.error("Error updating permissions:", error);
        alert("Failed to update permissions. Please try again.");
      }
    }
  };

  // Helper to display rules in a readable format
  const displayRules = (rules) => {
    if (!rules || rules.length === 0) {
      return "No permissions assigned";
    }
    
    return rules.map(rule => rule.replace(/can|Paper/g, '')).join(', ');
  };

  return (
    <Box>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Users
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid item xs={12} lg={9}>
          <div style={{ height: 400, width: "131%" }}>
            <DataGrid
              rows={usersData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              onRowClick={handleRowClick}
            />
          </div>
        </Grid>
      </Grid>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Paper sx={{ p: 4, width: 500, mx: "auto", my: "10%" }}>
          <Typography component="h2" variant="h4" sx={{ mb: 2 }}>
            {selectedUser && selectedUser.name}
          </Typography>
          {selectedUser && (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Current Role: <strong>{selectedUser.userType}</strong>
              </Typography>

              {/* Committee Member Rules Section */}
              {selectedUser.userType === "committeeMember" && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: "medium" }}>
                    Committee Permissions
                  </Typography>
                  
                  {/* Display current rules */}
                  <Box sx={{ mb: 2, p: 2, bgcolor: '', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Current Permissions:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {displayRules(selectedUser.rules)}
                    </Typography>
                  </Box>
                  
                  <FormControl sx={{ width: '100%', mb: 2 }}>
                    <InputLabel id="committee-rules-label">Assign Permissions</InputLabel>
                    <Select
                      labelId="committee-rules-label"
                      id="committee-rules-select"
                      multiple
                      value={selectedRules}
                      onChange={handleRuleChange}
                      input={<OutlinedInput label="Assign Permissions" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip 
                              key={value} 
                              label={value.replace(/can|Paper/g, '')} 
                              size="small"
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {availableRules.map((rule) => (
                        <MenuItem key={rule} value={rule}>
                          <Checkbox checked={selectedRules.indexOf(rule) > -1} />
                          <ListItemText 
                            primary={rule.replace(/can/, '')} 
                            secondary={getPermissionDescription(rule)}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSaveRules}
                    fullWidth
                  >
                    Save Permissions
                  </Button>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2} sx={{ mt: 3 }}>
                {/* Role management buttons */}
                {selectedUser.userType !== "committeeMember" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePromoteUser}
                    fullWidth
                  >
                    Promote to Committee Member
                  </Button>
                )}

                {selectedUser.userType === "committeeMember" && (
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleDemoteUser}
                    fullWidth
                  >
                    Demote from Committee Member
                  </Button>
                )}

                <Divider sx={{ my: 1 }} />

                {/* Ban/Unban buttons */}
                {selectedUser.banned ? (
                  <Button
                    variant="contained"
                    onClick={handleUnbanUser}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Unban User
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleBanUser}
                    fullWidth
                    sx={{ mt: 2 }}
                    color="error"
                  >
                    Ban User
                  </Button>
                )}
              </Stack>
            </>
          )}
        </Paper>
      </Modal>
    </Box>
  );
};

// Helper function to get human-readable descriptions for permissions
function getPermissionDescription(rule) {
  const descriptions = {
    canReviewPaper: "Can evaluate submitted papers",
    canRejectPaper: "Can decline paper submissions",
    canApprovePaper: "Can accept paper submissions",
    canSuspendPaper: "Can suspend paper submissions",
  };
  
  return descriptions[rule] || "";
}