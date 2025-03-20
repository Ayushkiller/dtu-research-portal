import * as React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
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
import { Dialog, Divider, FormControl, FormLabel, IconButton, List, ListItem, InputAdornment, Card, CardContent, Chip, Badge, Tooltip, Tab, Tabs } from "@mui/material";
import { UserTable } from "./UserTable";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import SchoolIcon from '@mui/icons-material/School';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function DeanGrid() {
  const [usersData, setUsersData] = React.useState([]);
  const [researchPapersData, setResearchPapersData] = React.useState([]);
  const [selectedPaper, setSelectedPaper] = React.useState(null);
  const [openPaperModal, setOpenPaperModal] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);
  const [openQuestionModal, setOpenQuestionModal] = React.useState(false);
  const [selectedQuestion, setSelectedQuestion] = React.useState(null);
  const [questionUpdateModel, setQuestionUpdateModel] = React.useState(null)
  const [dropdownOptions, setDropdownOptions] = React.useState([]); 
  const [searchText, setSearchText] = React.useState('');
  const [paperFilter, setPaperFilter] = React.useState('all');
  const [tabValue, setTabValue] = React.useState(0);

  const fetchQuestions = async () => {
    try {
      const response = await API.get("/dean/question");
      console.log(response.data);

      const questions = await response.data.map((question) => ({
        id: question._id,
        options : question.options,
        questionText: question.questionText,
        questionType: question.questionType,
        required: question.isRequired,
      }));

      setQuestions(questions);
     
      
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchUsers = async () => {
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

  const fetchPapers = async () => {
    try {
      const response = await API.get("/dean/research-papers");

      const papers = response.data.map((paper) => {
        const paperDetails = paper.paperDetails;
        // Map questionText to answer
        const researchPaperData = Object.entries(paperDetails).map(
          ([key, value], index) => {
           
            return {
              questionText: value.questionText,
              answer: value.answer,
            };
          }
        );
       
        
        console.log(researchPaperData)

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

  React.useEffect(() => {
    fetchQuestions();
  }, []);
  // Fetch users data from backend
  React.useEffect(() => {
    fetchUsers();
  }, []);
  
  React.useEffect(() => {
   fetchPapers();
  }, [selectedPaper]);

  const handleResearchRowClick = (params) => {
    setSelectedPaper(params.row);
    setOpenPaperModal(true);
  };
  const handleQuestionRowClick = (params) => {
    console.log(params.row);
    setSelectedQuestion(params?.row);
    setOpenQuestionModal(true);
  };

  const handleClosePaperModal = () => {
    setOpenPaperModal(false);
    setSelectedPaper(null);
  };
  const handleCloseQuestionModal = () => {
    setOpenQuestionModal(false);
    setSelectedQuestion(null);
  }
  const handleCloseUpdateQuestionModal = () => {
    setQuestionUpdateModel(false);
  }

  const handleQuestionTypeChange = (event) => {
    setSelectedQuestion({
      ...selectedQuestion,
      questionType: event.target.value,
    });
  };

  const handleOptionChange = (index, event) => {
    const updatedOptions = [...dropdownOptions];
    updatedOptions[index] = event.target.value;
    setDropdownOptions(updatedOptions); 
    setSelectedQuestion({ 
      ...selectedQuestion, 
      options: updatedOptions 
    });
  };

  const handleAddOption = () => {
    setDropdownOptions([...dropdownOptions, '']); 
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = [...dropdownOptions];
    updatedOptions.splice(index, 1);
    setDropdownOptions(updatedOptions);
    setSelectedQuestion({
      ...selectedQuestion,
      options: updatedOptions,
    });
  };

  const questionTypeOptions = [
    { value: 'text', label: 'Text' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio' },
    { value: 'multiple_select', label: 'Multiple Select' },
  ];

  const columns = [
    { field: "employeeId", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "userType", headerName: "User Type", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "mobileNo", headerName: "Mobile No", flex: 1 },
    { field: "banned", headerName: "Banned", flex: 1 },
  ];

  const paperColumns = [
    { field: "applicantName", headerName: "Applicant Name", flex: 1 },
    { field: "paperTitle", headerName: "Paper Title", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    { field: "pubYear", headerName: "Publication Year", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
  ];

  const questionColumns = [
    { field: "questionText", headerName: "Question Text", flex: 1 },
    { field: "questionType", headerName: "Question Type", flex: 1 },
    { field: "required", headerName: "Required", flex: 1 },
  ];

  const handleUpdateStatus = async (status) => {
    if (!selectedPaper) return;

    try {
      const response = await API.put(
        `/dean/research-ppapers/${selectedPaper.id}/status`,
        {
          status,
          comments: null, // You can allow the user to add comments if needed
        }
      );
      fetchPapers();
    
      alert(`Research paper ${status}`);
      setOpenPaperModal(false); // Close modal after action
    } catch (error) {
      console.error("Failed to update research paper status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  // Calculate summary statistics for users
  const totalUsers = usersData.length;
  const facultyCount = usersData.filter(user => user.userType === 'faculty').length;
  const adminCount = usersData.filter(user => user.userType === 'admin').length;
  const bannedUsers = usersData.filter(user => user.banned).length;
  
  // Calculate statistics for research papers
  const totalPapers = researchPapersData.length;
  const approvedPapers = researchPapersData.filter(paper => paper.status === 'approved').length;
  const pendingPapers = researchPapersData.filter(paper => paper.status === 'pending').length;
  const rejectedPapers = researchPapersData.filter(paper => paper.status === 'rejected').length;

  // Filter papers based on status and search text
  const filteredPapers = React.useMemo(() => {
    return researchPapersData.filter(paper => {
      const matchesFilter = paperFilter === 'all' || paper.status === paperFilter;
      const matchesSearch = !searchText || 
        paper.paperTitle.toLowerCase().includes(searchText.toLowerCase()) ||
        paper.applicantName.toLowerCase().includes(searchText.toLowerCase()) ||
        paper.department.toLowerCase().includes(searchText.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [researchPapersData, paperFilter, searchText]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  // Enhanced paper columns with status chip
  const enhancedPaperColumns = [
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
            params.value === 'approved' ? <CheckCircleIcon /> : 
            params.value === 'pending' ? <PendingIcon /> : 
            <CancelIcon />
          }
        />
      )
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Users Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GroupIcon sx={{ fontSize: 28, mr: 1, color: '#1976d2' }} />
            <Typography component="h2" variant="h5" sx={{ fontWeight: 'medium', color: '#1976d2' }}>
              User Management
            </Typography>
          </Box>
          <TextField
            placeholder="Search users..."
            size="small"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
        </Box>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#f0f7ff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Total Users</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'medium', mt: 0.5 }}>{totalUsers}</Typography>
                </Box>
                <GroupIcon sx={{ fontSize: 40, color: '#1976d2', opacity: 0.8 }} />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#f5f5fd', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Faculty</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'medium', mt: 0.5 }}>{facultyCount}</Typography>
                </Box>
                <SchoolIcon sx={{ fontSize: 40, color: '#7e57c2', opacity: 0.8 }} />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#f5fcf5', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Administrative</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'medium', mt: 0.5 }}>{adminCount}</Typography>
                </Box>
                <PersonIcon sx={{ fontSize: 40, color: '#43a047', opacity: 0.8 }} />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#fff5f5', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Banned Users</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'medium', mt: 0.5 }}>{bannedUsers}</Typography>
                </Box>
                <Badge badgeContent={bannedUsers} color="error">
                  <PeopleOutlineIcon sx={{ fontSize: 40, color: '#e53935', opacity: 0.8 }} />
                </Badge>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button 
            startIcon={<RefreshIcon />} 
            onClick={fetchUsers}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<FilterListIcon />}
          >
            Filter
          </Button>
        </Box>
        
        <UserTable setUsersData={setUsersData} columns={columns} fetchUsers={fetchUsers} usersData={usersData}/>
      </Paper>

      {/* Research Papers Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ArticleIcon sx={{ fontSize: 28, mr: 1, color: '#1976d2' }} />
            <Typography component="h2" variant="h5" sx={{ fontWeight: 'medium', color: '#1976d2' }}>
              Research Papers
            </Typography>
          </Box>
          <TextField
            placeholder="Search papers..."
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
                  <IconButton size="small" onClick={() => setSearchText('')}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ width: 250 }}
          />
        </Box>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                bgcolor: '#f5f5f5', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                borderLeft: paperFilter === 'all' ? '4px solid #1976d2' : 'none',
                '&:hover': { bgcolor: '#f0f0f0' }
              }}
              onClick={() => setPaperFilter('all')}
            >
              <CardContent sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Total Papers</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'medium', mt: 0.5 }}>{totalPapers}</Typography>
                </Box>
                <ArticleIcon sx={{ fontSize: 40, color: '#616161', opacity: 0.8 }} />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                bgcolor: '#f0f7f0', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                borderLeft: paperFilter === 'approved' ? '4px solid #4caf50' : 'none',
                '&:hover': { bgcolor: '#e8f5e9' }
              }}
              onClick={() => setPaperFilter('approved')}
            >
              <CardContent sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Approved</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'medium', mt: 0.5 }}>{approvedPapers}</Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50', opacity: 0.8 }} />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                bgcolor: '#fff8e1', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                borderLeft: paperFilter === 'pending' ? '4px solid #ff9800' : 'none',
                '&:hover': { bgcolor: '#ffecb3' }
              }}
              onClick={() => setPaperFilter('pending')}
            >
              <CardContent sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Pending</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'medium', mt: 0.5 }}>{pendingPapers}</Typography>
                </Box>
                <PendingIcon sx={{ fontSize: 40, color: '#ff9800', opacity: 0.8 }} />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                bgcolor: '#ffebee', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                borderLeft: paperFilter === 'rejected' ? '4px solid #f44336' : 'none',
                '&:hover': { bgcolor: '#ffcdd2' }
              }}
              onClick={() => setPaperFilter('rejected')}
            >
              <CardContent sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Rejected</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'medium', mt: 0.5 }}>{rejectedPapers}</Typography>
                </Box>
                <CancelIcon sx={{ fontSize: 40, color: '#f44336', opacity: 0.8 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            aria-label="research paper tabs"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab 
              icon={<ArticleIcon />} 
              iconPosition="start" 
              label="All Papers" 
              value={0} 
            />
            <Tab 
              icon={<PendingIcon />} 
              iconPosition="start" 
              label="Pending" 
              value={1} 
            />
            <Tab 
              icon={<CheckCircleIcon />} 
              iconPosition="start" 
              label="Approved" 
              value={2} 
            />
            <Tab 
              icon={<CancelIcon />} 
              iconPosition="start" 
              label="Rejected" 
              value={3} 
            />
          </Tabs>
        </Box>
        
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={filteredPapers}
            columns={enhancedPaperColumns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            onRowClick={handleResearchRowClick}
            sx={{ 
              '& .MuiDataGrid-cell:hover': { color: 'primary.main' },
              border: 'none',
              borderRadius: 2,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              // Conditional row styling based on status
              '& .MuiDataGrid-row': {
                '&:nth-of-type(odd)': {
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                },
              },
              // Status-based row styling
              '& .approved-row': {
                borderLeft: '4px solid #4caf50',
              },
              '& .pending-row': {
                borderLeft: '4px solid #ff9800',
              },
              '& .rejected-row': {
                borderLeft: '4px solid #f44336',
              },
            }}
            getRowClassName={(params) => params.row.status}
            disableSelectionOnClick
            components={{
              NoRowsOverlay: () => (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography variant="h6" color="text.secondary">No Research Papers</Typography>
                  <Typography variant="body2" color="text.secondary">No papers match your filters</Typography>
                </Box>
              ),
            }}
          />
        </Box>
      </Paper>

      {/* Question Management Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography component="h2" variant="h5" sx={{ mb: 3, fontWeight: 'medium', color: '#1976d2' }}>
          Question Management
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={questions}
                columns={questionColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                onRowClick={handleQuestionRowClick}
                sx={{ 
                  '& .MuiDataGrid-cell:hover': { color: 'primary.main' },
                  border: 'none',
                  borderRadius: 2,
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography component="h3" variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                Add New Question
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>Question Text</FormLabel>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={selectedQuestion?.questionText || ""}
                  onChange={(e) =>
                    setSelectedQuestion({
                      ...selectedQuestion,
                      questionText: e.target.value,
                    })
                  }
                />
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>Question Type</FormLabel>
                <Select
                  value={selectedQuestion?.questionType || ""}
                  onChange={(e) =>
                    setSelectedQuestion({
                      ...selectedQuestion,
                      questionType: e.target.value,
                    })
                  }
                  displayEmpty
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="" disabled>
                    Select Question Type
                  </MenuItem>
                  {questionTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {selectedQuestion?.questionType === "dropdown" && (
                <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Options
                  </Typography>
                  <List sx={{ py: 0 }}>
                    {dropdownOptions.map((option, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 1 }}>
                        <TextField
                          label={`Option ${index + 1}`}
                          variant="outlined"
                          fullWidth
                          size="small"
                          value={option}
                          onChange={(event) => handleOptionChange(index, event)}
                        />
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleRemoveOption(index)}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddOption}
                    sx={{ mt: 1 }}
                  >
                    Add Option
                  </Button>
                </Box>
              )}
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>Required</FormLabel>
                <Select
                  value={selectedQuestion?.required || false}
                  onChange={(e) =>
                    setSelectedQuestion({
                      ...selectedQuestion,
                      required: e.target.value,
                    })
                  }
                  displayEmpty
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value={false}>No</MenuItem>
                  <MenuItem value={true}>Yes</MenuItem>
                </Select>
              </FormControl>
              
              <Button
                onClick={async () => {
                  try {
                    const response = await API.post("/dean/question", {
                      questionText: selectedQuestion.questionText,
                      questionType: selectedQuestion.questionType,
                      options: selectedQuestion.options,
                      isRequired: selectedQuestion.required,
                    });
                    fetchQuestions();
                    setSelectedQuestion(null);
                    setDropdownOptions([]);
                    alert("Question added successfully.");
                  } catch (error) {
                    console.error("Error adding question:", error);
                    alert("Failed to add question. Please try again.");
                  }
                }}
                variant="contained"
                fullWidth
              >
                Add Question
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Paper Details Modal */}
      <Modal open={openPaperModal} onClose={handleClosePaperModal}>
        <Paper sx={{ 
          p: 4, 
          maxWidth: 600, 
          width: '90%', 
          mx: "auto", 
          my: "5%", 
          borderRadius: 2,
          maxHeight: '80vh',
          overflow: 'auto'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Paper Details
            </Typography>
            <IconButton onClick={handleClosePaperModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {selectedPaper && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5, color: '#1976d2' }}>
                  Paper Title
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedPaper.paperTitle}
                </Typography>
                
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5, color: '#1976d2' }}>
                  Applicant Name
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedPaper.applicantName}
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5, color: '#1976d2' }}>
                      Department
                    </Typography>
                    <Typography variant="body1">
                      {selectedPaper.department}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5, color: '#1976d2' }}>
                      Publication Year
                    </Typography>
                    <Typography variant="body1">
                      {selectedPaper.pubYear}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                Research Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                {selectedPaper.researchPaperData.map((data, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {data.questionText}
                    </Typography>
                    <Typography variant="body1">
                      {data.answer}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleClosePaperModal}
                >
                  Cancel
                </Button>
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

      {/* Question Details Modal */}
      <Modal open={openQuestionModal} onClose={handleCloseQuestionModal}>
        <Paper sx={{ 
          p: 4, 
          maxWidth: 500, 
          width: '90%', 
          mx: "auto", 
          my: "10%", 
          borderRadius: 2 
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Question Details
            </Typography>
            <IconButton onClick={handleCloseQuestionModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />

          {selectedQuestion && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5, color: '#1976d2' }}>
                  Question Text
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedQuestion.questionText}
                </Typography>
                
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5, color: '#1976d2' }}>
                  Question Type
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedQuestion.questionType}
                </Typography>
                
                {selectedQuestion.questionType === "dropdown" && (
                  <>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5, color: '#1976d2' }}>
                      Options
                    </Typography>
                    <List sx={{ bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }}>
                      {selectedQuestion?.options?.map((op, index) => (
                        <ListItem key={index}>{op}</ListItem>
                      ))}
                    </List>
                  </>
                )}
                
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5, color: '#1976d2' }}>
                  Required
                </Typography>
                <Typography variant="body1">
                  {selectedQuestion.required ? "Yes" : "No"}
                </Typography>
              </Box>

              <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={async () => {
                    try {
                      await API.delete(`/dean/question/${selectedQuestion.id}`);
                      fetchQuestions();
                      setOpenQuestionModal(false);
                      alert("Question deleted successfully.");
                    } catch (error) {
                      console.error("Error deleting question:", error);
                      alert("Failed to delete question. Please try again.");
                    }
                  }}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    setQuestionUpdateModel(true);
                    setDropdownOptions(selectedQuestion.options);
                  }}
                >
                  Edit
                </Button>
              </Box>
            </>
          )}
          
          {/* Question Update Dialog */}
          {questionUpdateModel && (
            <Dialog 
              open={questionUpdateModel} 
              onClose={handleCloseUpdateQuestionModal}
              fullWidth
              maxWidth="sm"
            >
              <Paper sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" component="h2">
                    Update Question
                  </Typography>
                  <IconButton onClick={handleCloseUpdateQuestionModal} size="small">
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>Question Text</FormLabel>
                  <TextField
                    variant="outlined"
                    value={selectedQuestion.questionText}
                    onChange={(e) => {
                      setSelectedQuestion({
                        ...selectedQuestion,
                        questionText: e.target.value,
                      });
                    }}
                    fullWidth
                    size="small"
                  />
                </FormControl>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>Question Type</FormLabel>
                  <Select
                    value={selectedQuestion.questionType}
                    onChange={handleQuestionTypeChange}
                    displayEmpty
                    variant="outlined"
                    size="small"
                  >
                    {questionTypeOptions?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                {selectedQuestion.questionType === 'dropdown' && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Options
                    </Typography>
                    <List sx={{ py: 0 }}>
                      {dropdownOptions?.length > 0 &&
                        dropdownOptions?.map((option, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 1 }}>
                          <TextField 
                            label={`Option ${index + 1}`} 
                            variant="outlined" 
                            fullWidth 
                            size="small" 
                            value={option} 
                            onChange={(event) => handleOptionChange(index, event)} 
                          />
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleRemoveOption(index)}
                            sx={{ ml: 1 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={handleAddOption} 
                      sx={{ mt: 1 }} 
                    >
                      Add Option
                    </Button>
                  </Box>
                )}
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <FormLabel sx={{ mb: 1, fontSize: '0.875rem' }}>Required</FormLabel>
                  <Select
                    value={selectedQuestion.required} 
                    onChange={(e) => setSelectedQuestion(
                      {
                        ...selectedQuestion,
                        required: e.target.value
                      }
                    )}
                    displayEmpty
                    variant="outlined"
                    size="small"
                  >
                    <MenuItem value={false}>No</MenuItem>
                    <MenuItem value={true}>Yes</MenuItem>
                  </Select>
                </FormControl>
                
                <Button 
                  onClick={async() => {
                    if(selectedQuestion.questionType !== 'dropdown') {
                      setSelectedQuestion({
                        ...selectedQuestion,
                        options: [],
                      });
                    }
                    try {
                      await API.put(`/dean/question/${selectedQuestion.id}`,
                      {
                        questionText: selectedQuestion.questionText,
                        questionType: selectedQuestion.questionType,
                        options: selectedQuestion.options,
                        isRequired: selectedQuestion.required,
                      });
                      fetchQuestions();
                      setQuestionUpdateModel(false);
                      alert("Question updated successfully.");
                    } catch (error) {
                      console.error("Error updating question:", error);
                      alert("Failed to update question. Please try again.");
                    }
                  }}
                  variant="contained"
                  fullWidth
                >
                  Update
                </Button>
              </Paper>
            </Dialog>
          )}
        </Paper>
      </Modal>

      <Copyright sx={{ mt: 6, mb: 4, textAlign: 'center' }} />
    </Box>
  );
}
