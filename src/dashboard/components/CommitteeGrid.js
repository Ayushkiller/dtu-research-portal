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
import TextField from "@mui/material/TextField";
import API from "../../api/axios";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
export default function DeanGrid() {
  const [usersData, setUsersData] = React.useState([]);
  const [researchPapersData, setResearchPapersData] = React.useState([]);
  const [selectedPaper, setSelectedPaper] = React.useState(null);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [openPaperModal, setOpenPaperModal] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [newPower, setNewPower] = React.useState("");
  const [me, setMe] = React.useState(null);
 

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


  // Fetch users data from backend
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get("/committee/accounts");
        console.log(response.data);
        const users = response.data.map((user) => ({
          id: user._id,
          employeeId: user.employeeId,
          name: user.name,
          email: user.email,
          mobileNo: user.mobileNumber,
          department: user.department,
          userType: user.userType,
          powers: user.powers || [],
        }));
        const updatedUsers = users.filter(
          (user) => user.userType !== "committeeMember"
        );

        setUsersData(updatedUsers);
        console.log(updatedUsers)
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [selectedUser]);

  React.useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await API.get("/committee/research-papers");
        console.log(response.data);

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
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchPapers();
  }, [selectedPaper]);

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


 

  


  const columns = [
    { field: "employeeId", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "userType", headerName: "User Type", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
  ];
  const paperColumns = [
    { field: "applicantName", headerName: "Applicant Name", flex: 1 },
    { field: "paperTitle", headerName: "Paper Title", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    { field: "pubYear", headerName: "Publication Year", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
  ];


  const predefinedPowers = [
    "suspendResearchPaper",
    "unsuspendResearchPaper",
    "putUnderReview",
    "addRemarks",
    "flagQuestion",
    "unflagQuestion",
    "changeShareAmount",
  ];

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

  return (
    <Box sx={{ flexGrow: 1 }}>
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
      <Copyright sx={{ my: 4 }} />

      <Modal open={openModal} onClose={handleCloseModal}>
        <Paper sx={{ p: 4, width: 400, mx: "auto", my: "10%" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            User Details
          </Typography>
          {selectedUser && (
            <>
              <Typography>Name: {selectedUser.name}</Typography>
              <Typography>Employee ID: {selectedUser.employeeId}</Typography>
              <Typography>Email: {selectedUser.email}</Typography>
              <Typography>Mobile No: {selectedUser.mobileNo}</Typography>
              <Typography>Department: {selectedUser.department}</Typography>
              <Typography>User Type: {selectedUser.userType}</Typography>

             
          

            </>
          )}
        </Paper>
      </Modal>

      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Research Papers
      </Typography>
      <Grid container spacing={2} columns={12}>
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
  );
}
