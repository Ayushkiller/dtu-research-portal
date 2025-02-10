import { Box, Button, Grid, MenuItem, Modal, Paper, Select, Stack, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React from 'react'
import API from '../../api/axios';

export const UserTable = ({usersData,setUsersData, columns, fetchUsers}) => {
    const [openModal, setOpenModal] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState(null);
    const [newPower, setNewPower] = React.useState("");
  // Fetch users data from backend
  React.useEffect(() => {
    fetchUsers();
  }, [selectedUser]);
  
  const predefinedPowers = [
    "suspendResearchPaper",
    "unsuspendResearchPaper",
    "putUnderReview",
    "addRemarks",
    "flagQuestion",
    "unflagQuestion",
    "changeShareAmount",
    "approveResearchPaper",
    "rejectResearchPaper",
  ];

    const handleRowClick = (params) => {
        setSelectedUser(params.row);
        setOpenModal(true);
      };
      const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedUser(null);
      };

      const handleAddPower = async () => {
        if (newPower && selectedUser) {
          try {
            const updatedUser = {
              ...selectedUser,
              powers: [...selectedUser.powers, newPower],
            };
    
            // Send updated powers to backend
            const response = await API.put(
              `/dean/delegate-powers/${selectedUser.id}`,
              {
                delegatedPowers: updatedUser.powers,
              }
            );
            if (response.status === 200) {
              setSelectedUser(updatedUser);
            }
    
            setNewPower("");
          } catch (error) {
            alert(error.response.data.error);
            console.error("Error adding power:", error);
          }
        }
      };

      const handleRemovePower = async (power) => {
        if (selectedUser) {
          const updatedPowers = selectedUser.powers.filter((p) => p !== power);
          setSelectedUser((prev) => ({
            ...prev,
            powers: updatedPowers,
          }));
    
          try {
            // Send updated powers to backend
            await API.put(`/dean/delegate-powers/${selectedUser.id}`, {
              delegatedPowers: updatedPowers,
            });
    
          } catch (error) {
            console.error("Error removing power:", error);
          }
        }
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

  return (
    <Box>
    <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Users
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid item xs={12} lg={9}>
          <div style={{ height: 400, width: "700px" }}>
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
        <Paper sx={{ p: 4, width: 400, mx: "auto", my: "10%" }}>
        <Typography component="h2" variant="h4" sx={{ mb: 2 }}>
        {selectedUser && selectedUser.name}
      </Typography>
          {selectedUser && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Powers :
              </Typography>
              <ul>
                {selectedUser.powers.map((power, index) => (
                  <li key={index}>
                    {power}{" "}
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemovePower(power)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Select
                  value={newPower}
                  onChange={(e) => setNewPower(e.target.value)}
                  displayEmpty
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="" disabled>
                    Select Power
                  </MenuItem>
                  {predefinedPowers.map((power) => (
                    <MenuItem key={power} value={power}>
                      {power}
                    </MenuItem>
                  ))}
                </Select>
                <Button variant="contained" onClick={handleAddPower}>
                  Add Power
                </Button>
              </Stack>

              {selectedUser.banned ? (
                <Button
                  variant="contained"
                  onClick={handleUnbanUser}
                  sx={{ mt: 2 }}
                >
                  Unban User
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleBanUser}
                  sx={{ mt: 2 }}
                  color="error"
                >
                  Ban User
                </Button>
              )}
            </>
          )}
        </Paper>
      </Modal>
    </Box>
  )
}
