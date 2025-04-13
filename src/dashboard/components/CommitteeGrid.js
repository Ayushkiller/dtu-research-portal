import * as React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Copyright from "../internals/components/Copyright";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import API from "../../api/axios";
import {
  Container,
  Divider,
  Chip,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function DeanGrid() {
  const [usersData, setUsersData] = React.useState([]);
  const [researchPapersData, setResearchPapersData] = React.useState([]);
  const [selectedPaper, setSelectedPaper] = React.useState(null);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [openPaperModal, setOpenPaperModal] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [actionToConfirm, setActionToConfirm] = React.useState(null);

  const [me, setMe] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Style constants for consistency
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: "600px" },
    maxHeight: "80vh",
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    overflow: "auto",
  };

  // Permission checking functions
  const hasPermission = (permission) => {
    return me?.rules?.includes(permission);
  };

  const canReviewPaper = hasPermission("canReviewPaper");
  const canRejectPaper = hasPermission("canRejectPaper");
  const canApprovePaper = hasPermission("canApprovePaper");
  const canSuspendPaper = hasPermission("canSuspendPaper");

  // Get current user data
  React.useEffect(() => {
    const fetchMe = async () => {
      setLoading(true);
      try {
        const response = await API.get("/user/me");
        setMe(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch your account details");
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  // Fetch users data from backend
  React.useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await API.get("/committee/accounts");
        const users = response.data.map((user) => ({
          id: user._id,
          employeeId: user.employeeId,
          name: user.name,
          email: user.email,
          mobileNo: user.mobileNumber,
          department: user.department,
          userType: user.userType,
          rules: user.rules || [],
        }));
        const updatedUsers = users.filter(
          (user) => user.userType !== "committeeMember"
        );

        setUsersData(updatedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users data");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [selectedUser]);

  // Fetch research papers
  React.useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      try {
        const response = await API.get("/committee/research-papers");

        const papers = response.data.map((paper) => {
          return {
            id: paper._id,
            applicantName: paper.applicantName,
            department: paper.department,
            paperTitle: paper.paperTitle,
            status: paper.status,
            pubYear: paper.pubYear,
          };
        });

        setResearchPapersData(papers);
      } catch (error) {
        console.error("Error fetching papers:", error);
        setError("Failed to fetch research papers");
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [selectedPaper]);

  // Event handlers
  const handleRowClick = (params) => {
    setSelectedUser(params.row);
    setOpenModal(true);
  };

  const handleResearchRowClick = (params) => {
    setSelectedPaper(params.row);
    setOpenPaperModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const handleClosePaperModal = () => {
    setOpenPaperModal(false);
    setSelectedPaper(null);
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "suspended":
        return "warning";
      case "underReview":
        return "info";
      default:
        return "default";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon fontSize="small" />;
      case "rejected":
        return <CancelIcon fontSize="small" />;
      case "suspended":
        return <WarningIcon fontSize="small" />;
      case "underReview":
        return <PendingIcon fontSize="small" />;
      default:
        return null;
    }
  };

  // Update paper status with permission check
  const handleUpdateStatus = async (status) => {
    if (!selectedPaper) return;

    // Check for appropriate permission based on the action
    let permissionNeeded = "";
    let actionDescription = "";

    switch (status) {
      case "approved":
        permissionNeeded = "canApprovePaper";
        actionDescription = "approve";
        break;
      case "rejected":
        permissionNeeded = "canRejectPaper";
        actionDescription = "reject";
        break;
      case "underReview":
        permissionNeeded = "canReviewPaper";
        permissionNeeded = "canReviewPaper";
        actionDescription = "review";
        break;
      case "suspended":
        permissionNeeded = "canSuspendPaper";
        actionDescription = "suspend";
        break;
      default:
        // Unexpected status
        setError(`Unknown action: ${status}`);
        return;
    }

    // Check if user has permission
    if (!hasPermission(permissionNeeded)) {
      setError(
        `You don't have permission to ${actionDescription} research papers`
      );
      return;
    }

    try {
      const response = await API.put(
        `/committee/research-papers/${selectedPaper.id}/status`,
        {
          status,
          comments: null,
        }
      );

      console.log(response.data.message);

      // Update the local state to reflect the change
      setResearchPapersData((prevPapers) =>
        prevPapers.map((paper) =>
          paper.id === selectedPaper.id ? { ...paper, status } : paper
        )
      );

      setError(null);
      setOpenPaperModal(false);

      // Show success message (you can use a snackbar here instead)
      alert(`Research paper status updated to: ${status}`);
    } catch (error) {
      console.error("Failed to update research paper status:", error);
      setError("Failed to update status. Please try again.");
    }
  };

  // New confirmation handling functions
  const handleConfirmAction = (status) => {
    setActionToConfirm(status);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
    setActionToConfirm(null);
  };

  const handleConfirmDialogConfirm = () => {
    if (actionToConfirm) {
      handleUpdateStatus(actionToConfirm);
      setConfirmDialogOpen(false);
      setActionToConfirm(null);
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case "approved":
        return "This paper has been approved and published";
      case "rejected":
        return "This paper has been rejected";
      case "suspended":
        return "This paper has been suspended pending further review";
      case "underReview":
        return "This paper is currently under review";
      default:
        return "";
    }
  };

  // DataGrid columns
  const columns = [
    {
      field: "employeeId",
      headerName: "ID",
      flex: 0.7,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1.5,
      renderCell: (params) => (
        <Typography variant="body2">{params.value}</Typography>
      ),
    },
    {
      field: "userType",
      headerName: "User Type",
      flex: 1,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value}
          color={params.value === "admin" ? "primary" : "default"}
        />
      ),
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1.2,
    },
    // {
    //   field: "rules",
    //   headerName: "Permissions",
    //   flex: 1.5,
    //   renderCell: (params) => (
    //     <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
    //       {params.value && params.value.map((rule, index) => (
    //         <Chip
    //           key={index}
    //           size="small"
    //           label={rule.replace("can", "").replace(/([A-Z])/g, " $1").trim()}
    //           color="secondary"
    //           variant="outlined"
    //           sx={{ fontSize: "0.7rem" }}
    //         />
    //       ))}
    //     </Box>
    //   ),
    // },
    {
      field: "actions",
      headerName: "View",
      width: 70,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="View Details">
          <IconButton size="small" onClick={() => handleRowClick(params)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const paperColumns = [
    {
      field: "applicantName",
      headerName: "Applicant Name",
      flex: 1.2,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      ),
    },
    {
      field: "paperTitle",
      headerName: "Paper Title",
      flex: 2,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Typography
            variant="body2"
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    { field: "department", headerName: "Department", flex: 1 },
    {
      field: "pubYear",
      headerName: "Publication Year",
      flex: 0.8,
      type: "number",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          icon={getStatusIcon(params.value)}
          size="small"
          label={params.value}
          color={getStatusColor(params.value)}
        />
      ),
    },
    {
      field: "actions",
      headerName: "View",
      width: 70,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="View Details">
          <IconButton
            size="small"
            onClick={() => handleResearchRowClick(params)}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setError(null)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "medium", color: "primary.main" }}
        >
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage users and research papers.
        </Typography>
        {me && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Your Permissions:
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
              {me.rules && me.rules.map((rule, index) => (
                <Chip
                  key={index}
                  size="small"
                  label={rule.replace("can", "").replace(/([A-Z])/g, " $1").trim()}
                  color="primary"
                  variant="outlined"
                />
              ))}
              {(!me.rules || me.rules.length === 0) && (
                <Typography variant="body2" color="error">
                  No permissions assigned
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: "medium" }}>
            Users
          </Typography>
          <Chip label={`${usersData.length} users`} size="small" />
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={usersData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 25]}
            loading={loading}
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "action.hover",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
              border: "none",
              boxShadow: "none",
              borderRadius: 1,
            }}
          />
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: "medium" }}>
            Research Papers
          </Typography>
          <Chip label={`${researchPapersData.length} papers`} size="small" />
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={researchPapersData}
            columns={paperColumns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 25]}
            loading={loading}
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "action.hover",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
              border: "none",
              boxShadow: "none",
              borderRadius: 1,
            }}
          />
        </Box>
      </Paper>

      {/* User Details Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Paper sx={modalStyle}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              User Details
            </Typography>
            <IconButton size="small" onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {selectedUser && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedUser.name}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Employee ID
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedUser.employeeId}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedUser.email}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Mobile Number
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedUser.mobileNo}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedUser.department}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  User Type
                </Typography>
                <Chip
                  size="small"
                  label={selectedUser.userType}
                  color={
                    selectedUser.userType === "admin" ? "primary" : "default"
                  }
                  sx={{ mt: 1 }}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                  Permissions
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                  {selectedUser.rules && selectedUser.rules.map((rule, index) => (
                    <Chip
                      key={index}
                      size="small"
                      label={rule.replace("can", "").replace(/([A-Z])/g, " $1").trim()}
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                  {(!selectedUser.rules || selectedUser.rules.length === 0) && (
                    <Typography variant="body2" color="error">
                      No permissions assigned
                    </Typography>
                  )}
                </Box>
              </Grid> */}
            </Grid>
          )}
        </Paper>
      </Modal>

      {/* Research Paper Details Modal */}
      <Modal open={openPaperModal} onClose={handleClosePaperModal}>
        <Paper sx={modalStyle}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Paper Details
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {selectedPaper && (
                <Chip
                  icon={getStatusIcon(selectedPaper.status)}
                  size="small"
                  label={selectedPaper.status}
                  color={getStatusColor(selectedPaper.status)}
                  sx={{ mr: 1 }}
                />
              )}
              <IconButton size="small" onClick={handleClosePaperModal}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {selectedPaper && (
            <>
              <Typography variant="h6" gutterBottom color="primary.main">
                {selectedPaper.paperTitle}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Applicant
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedPaper.applicantName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedPaper.department}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Publication Year
                  </Typography>
                  <Typography variant="body1">
                    {selectedPaper.pubYear}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Alert 
                      icon={getStatusIcon(selectedPaper.status)} 
                      severity={getStatusColor(selectedPaper.status)}
                    >
                      {getStatusDescription(selectedPaper.status)}
                    </Alert>
                  </Box>
                </Grid>
              </Grid>

              <Typography
                variant="subtitle1"
                sx={{ mt: 2, mb: 1, fontWeight: "medium" }}
              >
                Paper Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography
                variant="subtitle1"
                sx={{ mt: 4, mb: 1, fontWeight: "medium" }}
              >
                Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 3,
                }}
              >
                <Box sx={{ display: "flex", gap: 2, flexGrow: 1, justifyContent: "center" }}>
                  <Tooltip title={!canReviewPaper ? "You need 'Review Paper' permission" : "Set paper under review"}>
                    <span>
                      <Button
                        variant="outlined"
                        color="info"
                        onClick={() => handleUpdateStatus("underReview")}
                        disabled={!canReviewPaper || selectedPaper.status === "underReview"}
                        startIcon={<PendingIcon />}
                        fullWidth
                      >
                        Under Review
                      </Button>
                    </span>
                  </Tooltip>
                  
                  <Tooltip title={!canSuspendPaper ? "You need 'Suspend Paper' permission" : "Mark as suspended"}>
                    <span>
                      <Button
                        variant="outlined"
                        color="warning"
                        onClick={() => handleUpdateStatus("suspended")}
                        disabled={!canSuspendPaper || selectedPaper.status === "suspended"}
                        startIcon={<WarningIcon />}
                        fullWidth
                      >
                        Suspend
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
                
                <Divider flexItem sx={{ display: { xs: 'block', sm: 'none' } }} />
                
                <Box sx={{ display: "flex", gap: 2, flexGrow: 1, justifyContent: "center" }}>
                  <Tooltip title={!canApprovePaper ? "You need 'Approve Paper' permission" : "Approve this paper"}>
                    <span>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleConfirmAction("approved")}
                        disabled={!canApprovePaper || selectedPaper.status === "approved"}
                        startIcon={<CheckCircleIcon />}
                        fullWidth
                      >
                        Approve
                      </Button>
                    </span>
                  </Tooltip>
                  
                  <Tooltip title={!canRejectPaper ? "You need 'Reject Paper' permission" : "Reject this paper"}>
                    <span>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleConfirmAction("rejected")}
                        disabled={!canRejectPaper || selectedPaper.status === "rejected"}
                        startIcon={<CancelIcon />}
                        fullWidth
                      >
                        Reject
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </Modal>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleConfirmDialogClose}
      >
        <DialogTitle>
          {actionToConfirm === "approved" ? "Approve Paper?" : "Reject Paper?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {actionToConfirm === "approved" ? "approve" : "reject"} this research paper?
            This action cannot be easily undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose}>Cancel</Button>
          <Button 
            onClick={handleConfirmDialogConfirm}
            color={actionToConfirm === "approved" ? "success" : "error"}
            variant="contained"
            autoFocus
          >
            Confirm {actionToConfirm === "approved" ? "Approval" : "Rejection"}
          </Button>
        </DialogActions>
      </Dialog>

      <Copyright sx={{ mt: 4, pb: 4 }} />
    </Container>
  );
} 