import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, CircularProgress, Box, Grid, Modal, Paper, Button, CssBaseline } from "@mui/material";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import { DataGrid } from "@mui/x-data-grid";
import AppTheme from "../../shared-theme/AppTheme";
import SideMenu from "./SideMenu";
import AppNavbar from "./AppNavbar";

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "../theme/customizations";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};


const CommitteeApprovals = () => {
  const { userId } = useParams(); // Get ID from URL params
  const [approval, setApproval] = useState(null);
  const [loading, setLoading] = useState(true);
    const token = Cookies.get("token");
    const [me, setMe] = useState({});
    const navigate = useNavigate();
  
  const [error, setError] = useState(null);
    const [researchPapersData, setResearchPapersData] = React.useState([]);
    const [selectedPaper, setSelectedPaper] = React.useState(null);
    const [openPaperModal, setOpenPaperModal] = React.useState(false);

    React.useEffect(() => {
        const fetchMe = async () => {
          try {
            const response = await API.get("/user/me");
            // console.log("-----------------",response.data);
            setMe(response.data);
          } catch (error) {
            console.error("Error fetching user:", error);
          }
        };
        fetchMe();
      }, []);

     React.useEffect(() => {
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
   const fetchApprovals = async () => {
        try {
            await API
            .get(`/research-paper-submission/approved/${userId}`)
            .then((response) => {
                const papers = response.data.map((paper) => {
                    const paperDetails = paper.paperDetails;
                    console.log(paperDetails);
                    // Map questionText to answer
                    const researchPaperData = Object.entries(paperDetails).map(
                      ([key, value], index) => {
                        console.log(`Processing entry ${index}:`, value);
                        return {
                          questionText: value.questionText,
                          answer: value.answer,
                        };
                      }
                    );
                    console.log("research paper data ", researchPaperData);
          
          
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
          
                  setResearchPapersData(papers);
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching approval data:", error);
              setError("Failed to load approval details");
              setLoading(false);
            });
        } catch (error) {
        setError(error.response.data.error);
        setLoading(false);
        }

   }
   fetchApprovals();
  }, [userId]);



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

  
  const handleUpdateStatus = async (status) => {
    if (!selectedPaper) return;
    if(status === "suspended" && me.powers.includes("suspendResearchPaper") === false){
      alert("You don't have permission to suspend research paper");
      return;
    }
    if(status === "underReview" && me.powers.includes("putUnderReview") === false){
      alert("You don't have permission to put research paper under review");
      return;
    }
    if(status === "approved" && me.powers.includes("approveResearchPaper") === false){
      alert("You don't have permission to approve research paper");
      return;
    }
    if(status === "rejected" && me.powers.includes("rejectResearchPaper") === false){
      alert("You don't have permission to reject research paper");
      return;
    }
    

    try {
      const response = await API.put(
        `/committee/research-papers/${selectedPaper.id}/status`,
        {
          status,
          comments: null, // You can allow the user to add comments if needed
        }
      );

      console.log(response.data.message);
      alert(`Research paper ${status}`);
      setOpenPaperModal(false); // Close modal after action
    } catch (error) {
      console.error("Failed to update research paper status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const paperColumns = [
    { field: "applicantName", headerName: "Applicant Name", flex: 1 },
    { field: "paperTitle", headerName: "Paper Title", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    { field: "pubYear", headerName: "Publication Year", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
  ];

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (

     <AppTheme themeComponents={xThemeComponents}>
          <CssBaseline enableColorScheme />
          <Box sx={{ display: "flex" }}>
            <SideMenu />
            <AppNavbar />
      <Grid container spacing={2} columns={12}>
      <Typography component="h2" variant="h6" sx={{ mb: 2, mt: 2 }}>
        Research Papers
      </Typography>
        <Grid item xs={12} lg={9}>
          <div style={{ height: 400, width: "700px" }}>
            <DataGrid
              rows={researchPapersData}
              columns={paperColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              onRowClick={handleResearchRowClick}
            />
          </div>
        </Grid>
      </Grid>

      <Modal open={openPaperModal} onClose={handleClosePaperModal}>
        <Paper sx={{ p: 4, width: 400, mx: "auto", my: "10%" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Paper Details
          </Typography>

          {selectedPaper && (
            <>
              <Typography>Paper Title: {selectedPaper.paperTitle}</Typography>
              <Typography>
                Applicant Name: {selectedPaper.applicantName}
              </Typography>
              <Typography>Department: {selectedPaper.department}</Typography>
              <Typography>Publication Year: {selectedPaper.pubYear}</Typography>
              <Typography>
                Impact Factor Of Journal: {selectedPaper.impactFactor}
              </Typography>
              {selectedPaper.researchPaperData.map((data, index) => (
                <div key={index}>
                  <Typography>
                    {data.questionText}: {data.answer}
                  </Typography>
                </div>
              ))}

              {/* Approve and Reject Buttons */}
              <Box
                sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleUpdateStatus("suspended")}
                >
                  Suspend
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleUpdateStatus("underReview")}
                >
                  Review
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleUpdateStatus("approved")}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleUpdateStatus("rejected")}
                >
                  Reject
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Modal>
    </Box>
    </AppTheme>
  );
};

export default CommitteeApprovals;
