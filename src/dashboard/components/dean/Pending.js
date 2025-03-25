import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import PendingIcon from "@mui/icons-material/Pending";
import API from "../../../api/axios";
import { PaperDetailsModal } from "./Modals";

const Pending = () => {
  const [pendingPapers, setPendingPapers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [openPaperModal, setOpenPaperModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchPendingPapers = async () => {
    setLoading(true);
    try {
      const response = await API.get("/dean/research-papers");
      // Filter only pending papers
      const papers = response.data
        .filter((paper) => paper.status === "Submitted")
        .map((paper) => {
          const paperDetails = paper.paperDetails;
          const researchPaperData = Object.entries(paperDetails).map(
            ([key, value]) => ({
              questionText: value.questionText,
              answer: value.answer,
            })
          );

          return {
            id: paper._id,
            applicantName: paper.applicantName,
            department: paper.department,
            paperTitle: paper.paperTitle,
            status: paper.status,
            pubYear: paper.pubYear,
            researchPaperData: researchPaperData,
          };
        });

      setPendingPapers(papers);
    } catch (error) {
      console.error("Error fetching pending papers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPapers();
  }, []);

  const handleResearchRowClick = (params) => {
    setSelectedPaper(params.row);
    setOpenPaperModal(true);
  };

  const handleClosePaperModal = () => {
    setOpenPaperModal(false);
    setSelectedPaper(null);
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedPaper) return;

    try {
      await API.put(`/dean/research-papers/${selectedPaper.id}/status`, {
        status,
        comments: null, // You can allow the user to add comments if needed
      });

      fetchPendingPapers();
      alert(`Research paper ${status}`);
      setOpenPaperModal(false); // Close modal after action
    } catch (error) {
      console.error("Failed to update research paper status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const filteredPapers = React.useMemo(() => {
    return pendingPapers.filter(
      (paper) =>
        !searchText ||
        paper.paperTitle.toLowerCase().includes(searchText.toLowerCase()) ||
        paper.applicantName.toLowerCase().includes(searchText.toLowerCase()) ||
        paper.department.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [pendingPapers, searchText]);

  const columns = [
    { field: "applicantName", headerName: "Applicant Name", flex: 1 },
    { field: "paperTitle", headerName: "Paper Title", flex: 2 },
    { field: "department", headerName: "Department", flex: 1 },
    { field: "pubYear", headerName: "Publication Year", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: () => (
        <Box
          sx={{ display: "flex", alignItems: "center", color: "warning.main" }}
        >
          <PendingIcon sx={{ mr: 0.5 }} />
          Pending
        </Box>
      ),
    },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PendingIcon sx={{ fontSize: 28, mr: 1, color: "#ff9800" }} />
          <Typography
            component="h2"
            variant="h5"
            sx={{ fontWeight: "medium", color: "#ff9800" }}
          >
            Pending Research Papers
          </Typography>
        </Box>
        <TextField
          placeholder="Search pending papers..."
          size="small"
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchText && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchText("")}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ width: 250 }}
        />
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Card
            sx={{
              bgcolor: "#fff8e1",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderLeft: "4px solid #ff9800",
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
                  Total Pending Papers
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "medium", mt: 0.5 }}>
                  {pendingPapers.length}
                </Typography>
              </Box>
              <PendingIcon
                sx={{ fontSize: 40, color: "#ff9800", opacity: 0.8 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ height: 450, width: "100%" }}>
        <DataGrid
          rows={filteredPapers}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          onRowClick={handleResearchRowClick}
          loading={loading}
          sx={{
            "& .MuiDataGrid-cell:hover": { color: "primary.main" },
            border: "none",
            borderRadius: 2,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            "& .MuiDataGrid-row": {
              "&:nth-of-type(odd)": {
                backgroundColor: "rgba(0, 0, 0, 0.02)",
              },
              borderLeft: "4px solid #ff9800",
            },
          }}
          disableSelectionOnClick
          components={{
            NoRowsOverlay: () => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No Pending Papers
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  There are no pending research papers yet
                </Typography>
              </Box>
            ),
          }}
        />
      </Box>

      {/* Paper Details Modal */}
      {selectedPaper && (
        <PaperDetailsModal
          openPaperModal={openPaperModal}
          handleClosePaperModal={handleClosePaperModal}
          selectedPaper={selectedPaper}
          handleUpdateStatus={handleUpdateStatus}
        />
      )}
    </Paper>
  );
};

export default Pending;
