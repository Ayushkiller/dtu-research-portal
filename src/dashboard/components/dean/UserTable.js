import {
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import API from "../../../api/axios";

export const UserTable = ({ usersData, setUsersData, columns, fetchUsers }) => {
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);

  // Fetch users data from backend
  React.useEffect(() => {
    fetchUsers();
  }, [selectedUser]);

  const handleRowClick = (params) => {
    setSelectedUser(params.row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
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
        <Paper sx={{ p: 4, width: 400, mx: "auto", my: "10%" }}>
          <Typography component="h2" variant="h4" sx={{ mb: 2 }}>
            {selectedUser && selectedUser.name}
          </Typography>
          {selectedUser && (
            <>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Current Role: <strong>{selectedUser.userType}</strong>
              </Typography>

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
