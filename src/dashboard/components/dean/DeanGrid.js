import * as React from "react";
import { 
  Box, 
  Chip, 
  Typography, 
  Paper, 
  Container, 
  Divider,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Button,
  useTheme
} from "@mui/material";
import Copyright from "../../internals/components/Copyright";
import API from "../../../api/axios";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { UserManagement } from "./UserManagement";
import { ResearchPapers } from "./ResearchPapers";
import { PaperDetailsModal} from "./Modals";
import {
  getStatusColor,
  columns,
  paperColumns,
} from "./deanGridHelper";

// Custom Tab Panel for better organization
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dean-tabpanel-${index}`}
      aria-labelledby={`dean-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function DeanGrid() {
  const theme = useTheme();
  const [usersData, setUsersData] = React.useState([]);
  const [researchPapersData, setResearchPapersData] = React.useState([]);
  const [selectedPaper, setSelectedPaper] = React.useState(null);
  const [openPaperModal, setOpenPaperModal] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [paperFilter, setPaperFilter] = React.useState("all");
  const [tabValue, setTabValue] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/dean/accounts");
      const users = response.data.map((user) => ({
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        mobileNo: user.mobileNumber,
        department: user.department,
        userType: user.userType,
        banned: user.isBanned,
      }));
      const updatedUsers = users.filter(
        (user) => user.userType !== "competentAuthority"
      );

      setUsersData(updatedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPapers = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/dean/research-papers");

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
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users data from backend
  React.useEffect(() => {
    fetchUsers();
    fetchPapers();
  }, []);

  React.useEffect(() => {
    if (selectedPaper === null && openPaperModal === false) {
      fetchPapers();
    }
  }, [selectedPaper, openPaperModal]);

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
      
      // Update local state first for immediate feedback
      setResearchPapersData(prevData => 
        prevData.map(paper => 
          paper.id === selectedPaper.id ? {...paper, status} : paper
        )
      );

      // Show toast notification instead of alert
      // Replace with your toast library of choice
      // toast.success(`Research paper ${status}`);
      
      setOpenPaperModal(false); // Close modal after action
    } catch (error) {
      console.error("Failed to update research paper status:", error);
      // toast.error("Failed to update status. Please try again.");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSearchText("");
    setPaperFilter("all");
  };

  const handleRefresh = () => {
    if (tabValue === 0) {
      fetchUsers();
    } else {
      fetchPapers();
    }
  };

  const enhancedPaperColumns = React.useMemo(() => {
    if (!paperColumns) {
      return [];
    }
    return [
      ...paperColumns.slice(0, 4),
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        renderCell: (params) => (
          <Chip
            label={params.value}
            color={getStatusColor(params.value)}
            size="small"
            icon={
              params.value === "approved" ? (
                <CheckCircleIcon />
              ) : params.value === "pending" ? (
                <PendingIcon />
              ) : (
                <CancelIcon />
              )
            }
            sx={{ 
              fontWeight: 500,
              minWidth: '90px',
              justifyContent: 'center'
            }}
          />
        ),
      },
    ];
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          mb: 4
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            Administration Dashboard
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="admin tabs"
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ mb: 2 }}
          >
            <Tab label="User Management" />
            <Tab label="Research Papers" />
          </Tabs>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={tabValue === 0 ? "Search users..." : "Search research papers..."}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Box>

        <TabPanel value={tabValue} index={0}>
          <UserManagement
            usersData={usersData}
            setUsersData={setUsersData}
            columns={columns}
            fetchUsers={fetchUsers}
            searchText={searchText}
            setSearchText={setSearchText}
            isLoading={isLoading}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ResearchPapers
            researchPapersData={researchPapersData}
            handleResearchRowClick={handleResearchRowClick}
            searchText={searchText}
            setSearchText={setSearchText}
            paperFilter={paperFilter}
            setPaperFilter={setPaperFilter}
            getStatusColor={getStatusColor}
            enhancedPaperColumns={enhancedPaperColumns}
            isLoading={isLoading}
          />
        </TabPanel>
      </Paper>

      {/* Paper Details Modal */}
      <PaperDetailsModal
        openPaperModal={openPaperModal}
        handleClosePaperModal={handleClosePaperModal}
        selectedPaper={selectedPaper}
        handleUpdateStatus={handleUpdateStatus}
      />

      <Box sx={{ mt: 4, mb: 2, textAlign: "center" }}>
        <Copyright />
      </Box>
    </Container>
  );
}