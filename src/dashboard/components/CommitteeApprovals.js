import React, { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  Box,
  Grid,
  Modal,
  Paper,
  Button,
  Chip,
  Divider,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import API from "../../api/axios";
import { DataGrid } from "@mui/x-data-grid";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import WarningIcon from "@mui/icons-material/Warning";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

const CommitteeApprovals = () => {
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");
  const [me, setMe] = useState({});
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");

  const [error, setError] = useState(null);
  const [researchPapersData, setResearchPapersData] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [openPaperModal, setOpenPaperModal] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);

  // Modal style for consistency
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

  // Set user ID from token
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await API.get("/user/me");
        setMe(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.userType !== "committeeMember") {
          alert("You are not authorized to view this page");
          navigate("/signin");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/signin");
      }
    } else {
      navigate("/signin");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchApprovedPapers = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get all papers for committee and filter by status
        const response = await API.get("/committee/research-papers/approved");

        // Filter only approved papers
        const papers = await response.data
          .map((paper) => ({
            id: paper._id,
            applicantName: paper.applicantName,
            department: paper.department,
            paperTitle: paper.paperTitle,
            status: paper.status,
            pubYear: paper.pubYear,
          }));

          // console.log("approved papers by CM" , papers)
        setResearchPapersData(await papers);
      } catch (error) {
        console.error("Error fetching approved papers:", error);
        setError("Failed to load approved papers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedPapers();
  }, []);

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

  
  // Permission checking functions
  const hasPermission = (permission) => {
    return me?.rules?.includes(permission);
  };

  const canReviewPaper = hasPermission("canReviewPaper");
  const canRejectPaper = hasPermission("canRejectPaper");
  const canApprovePaper = hasPermission("canApprovePaper");
  const canSuspendPaper = hasPermission("canSuspendPaper");

  const handleResearchRowClick = (params) => {
    setSelectedPaper(params.row);
    setOpenPaperModal(true);
  };

  const handleClosePaperModal = () => {
    setOpenPaperModal(false);
    setSelectedPaper(null);
  };

  const handleConfirmAction = (status) => {
    setActionToConfirm(status);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
    setActionToConfirm(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedPaper || !actionToConfirm) return;
    let permissionNeeded = "";
    let actionDescription = "";

    switch (actionToConfirm) {
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
        setError(`Unknown action: ${actionToConfirm}`);
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
          status: actionToConfirm,
          comments: null,
        }
      );

      // Update the local state to reflect the change
      setResearchPapersData((prevData) =>
        prevData.filter((paper) => paper.id !== selectedPaper.id)
      );

      setOpenPaperModal(false);
      setConfirmDialogOpen(false);
      setActionToConfirm(null);
    } catch (error) {
      console.error("Failed to update research paper status:", error);
      // Provide more helpful error message based on the error response
      if (error.response && error.response.status === 403) {
        setError(
          "You don't have permission to perform this action. Please ensure you are logged in as a committee member."
        );
      } else {
        setError("Failed to update status. Please try again.");
      }
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case "approved":
        return "approve";
      case "rejected":
        return "reject";
      case "suspended":
        return "suspend";
      case "underReview":
        return "set to review";
      default:
        return "update";
    }
  };

  const paperColumns = [
    {
      field: "paperTitle",
      headerName: "Paper Title",
      flex: 2,
      renderCell: (params) => (
        <Tooltip title="View details">
          <Typography
            sx={{
              cursor: "pointer",
              "&:hover": { textDecoration: "underline", color: "primary.main" },
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    { field: "applicantName", headerName: "Applicant Name", flex: 1.5 },
    { field: "department", headerName: "Department", flex: 1 },
    { field: "pubYear", headerName: "Publication Year", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          icon={getStatusIcon(params.value)}
          label={params.value
            .replace(/([A-Z])/g, " $1")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
          color={getStatusColor(params.value)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.7,
      renderCell: (params) => (
        <Tooltip title="View Details">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPaper(params.row);
              setOpenPaperModal(true);
            }}
            size="small"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
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
    );

  return (
    <>
      {/* Paper Data Grid */}
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={researchPapersData}
          columns={paperColumns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 25]}
          disableSelectionOnClick
          getRowClassName={(params) =>
            params.row.status === "approved" ? "row-highlight" : ""
          }
          sx={{
            "& .row-highlight": {
              backgroundColor: (theme) => theme.palette.success.lighter,
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: (theme) => theme.palette.primary.lighter,
              color: (theme) => theme.palette.primary.main,
              fontWeight: "bold",
            },
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
          }}
        />
      </Box>

      {/* Paper Details Modal */}
      <Modal
        open={openPaperModal}
        onClose={handleClosePaperModal}
        aria-labelledby="paper-details-modal"
      >
        <Box sx={modalStyle}>
          {selectedPaper && (
            <>
              <Typography
                variant="h5"
                component="h2"
                sx={{ color: "primary.main", mb: 2 }}
              >
                Paper Details
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {selectedPaper.paperTitle}
                  </Typography>
                  <Chip
                    icon={getStatusIcon(selectedPaper.status)}
                    label={selectedPaper.status
                      .replace(/([A-Z])/g, " $1")
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                    color={getStatusColor(selectedPaper.status)}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Applicant
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedPaper.applicantName}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedPaper.department}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Publication Year
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedPaper.pubYear}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Action Buttons */}
              <Box
                sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
              >
              <Tooltip title={!canSuspendPaper ? "You need 'Suspend Paper' permission" : "Suspend paper"}>
                <span>
                <Button
                  variant="outlined"
                  color="warning"
                  disabled={!canSuspendPaper || selectedPaper.status === "underReview"}
                  onClick={() => handleConfirmAction("suspended")}
                  startIcon={<WarningIcon />}
                >
                  Suspend
                </Button>

                </span>
              </Tooltip>
            <Tooltip title={!canReviewPaper ? "You need 'Review Paper' permission" : "Set paper under review"}>
              <span>
              <Button
                  variant="outlined"
                  color="info"
                  disabled={!canReviewPaper || selectedPaper.status === "underReview"}
                  onClick={() => handleConfirmAction("underReview")}
                  startIcon={<PendingIcon />}
                >
                  Review
                </Button>

              </span>
            </Tooltip>
                
               <Tooltip title={!canApprovePaper ? "You need 'Approve Paper' permission" : "Approve paper"}>
                <span>
                <Button
                  variant="contained"
                  color="success"
                  disabled={!canApprovePaper || selectedPaper.status === "underReview"}
                  onClick={() => handleConfirmAction("approved")}
                  startIcon={<CheckCircleIcon />}
                >
                  Approve
                </Button>

                </span>
               </Tooltip>
               <Tooltip title={!canRejectPaper ? "You need 'Reject Paper' permission" : "Reject paper"}>
                <span>

                <Button
                  variant="contained"
                  color="error"
                  disabled={!canRejectPaper || selectedPaper.status === "underReview"}
                  onClick={() => handleConfirmAction("rejected")}
                  startIcon={<CancelIcon />}
                >
                  Reject
                </Button>
                </span>
               </Tooltip>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Confirmation Dialog */}
      <Modal
        open={confirmDialogOpen}
        onClose={handleConfirmDialogClose}
        aria-labelledby="confirm-modal-title"
      >
        <Box
          sx={{
            ...modalStyle,
            width: { xs: "80%", sm: "400px" },
          }}
        >
          <Typography id="confirm-modal-title" variant="h6" component="h2">
            Confirm Action
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to{" "}
            {actionToConfirm ? getStatusDescription(actionToConfirm) : "update"}{" "}
            this research paper?
          </Typography>
          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button onClick={handleConfirmDialogClose} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} variant="contained" autoFocus>
              Confirm
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default CommitteeApprovals;
