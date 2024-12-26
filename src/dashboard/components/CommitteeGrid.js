import * as React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Copyright from "../internals/components/Copyright";
import CustomizedDataGrid from "./CustomizedDataGrid";
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

  const predefinedPowers = [
    "suspendResearchPaper",
    "unsuspendResearchPaper",
    "putUnderReview",
    "addRemarks",
    "flagQuestion",
    "unflagQuestion",
    "changeShareAmount",
  ];

  // Fetch users data from backend
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get("/dean/accounts");
        console.log(response.data);
        const users = response.data.map((user) => ({
          id: user._id,
          employeeId: user.employeeId,
          name: user.name,
          email: user.email,
          mobileNo: user.mobileNumber,
          department: user.department,
          userType: user.userType,
          banned: user.isBanned,
          powers: user.powers || [],
        }));
        const updatedUsers = users.filter(
          (user) => user.userType !== "competentAuthority"
        );

        setUsersData(updatedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [selectedUser]);

  React.useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await API.get("/dean/research-papers");
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

          const paperTitle = researchPaperData.find(
            (data) => data.questionText === "Paper Title"
          )?.answer;
          const pubYear = researchPaperData.find(
            (data) => data.questionText === "Publication Year"
          )?.answer;
          const impactFactor = researchPaperData.find(
            (data) => data.questionText === "Impact Factor of the Journal"
          )?.answer;
          const excludedQuestions = [
            "Publication Year",
            "Paper Title",
            "Impact Factor",
          ];
          const filteredResearchPaperData = researchPaperData.filter(
            (data) => !excludedQuestions.includes(data.questionText)
          );

          return {
            id: paper._id,
            applicantName: paper.applicantName,
            department: paper.department,
            paperTitle: paperTitle,
            status: paper.status,
            pubYear: pubYear,
            impactFactor: impactFactor,
            researchPaperData: filteredResearchPaperData,
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
        setOpenModal(false);
        alert(`${selectedUser.name} unbanned successfully.`);
      } catch (error) {
        console.error("Error unbanning user:", error);
      }
    }
  };

  const columns = [
    { field: "employeeId", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "userType", headerName: "User Type", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    { field: "banned", headerName: "Banned", flex: 1 },
  ];
  const paperColumns = [
    { field: "applicantName", headerName: "Applicant Name", flex: 1 },
    { field: "paperTitle", headerName: "Paper Title", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    { field: "impactFactor", headerName: "impact Factor", flex: 1 },
    { field: "pubYear", headerName: "Publication Year", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
  ];

  const handleUpdateStatus = async (status) => {
    if (!selectedPaper) return;

    try {
      const response = await API.put(
        `/dean/research-papers/${selectedPaper.id}/status`,
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
              <Typography variant="h6" sx={{ mt: 2 }}>
                Powers
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
                  color="success"
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
