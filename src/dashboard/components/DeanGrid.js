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
import { Dialog, List, ListItem } from "@mui/material";
import { UserTable } from "./UserTable";
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
        `/dean/research-papers/${selectedPaper.id}/status`,
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

  return (
    <Box sx={{ flexGrow: 1 }}>
    {/* Users Table  */}
    <UserTable setUsersData={setUsersData} columns={columns} fetchUsers={fetchUsers} usersData={usersData}/>

      <Typography component="h2" variant="h6" sx={{ mb: 2, mt: 4 }}>
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

      {/* Question Section */}
      <Typography component="h2" variant="h6" sx={{ mb: 2, mt: 4 }}>
        Questions
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid item xs={12} lg={9}>
          <div style={{ height: 400, width: "700px" }}>
            <DataGrid
              rows={questions}
              columns={questionColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              onRowClick={handleQuestionRowClick}
            />
          </div>
        </Grid>
      </Grid>
      
      <Modal  open={openQuestionModal} onClose={handleCloseQuestionModal}>
        <Paper sx={{ p: 4, width: 400, mx: "auto", my: "10%" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Question Details
          </Typography>


          {selectedQuestion && (
            <>
              <Typography>Question Text: {selectedQuestion.questionText}</Typography>
              <Typography>
                Question Type: {selectedQuestion.questionType}
              </Typography>
              {selectedQuestion.questionType === "dropdown" &&
                <Typography>Options: {      
                selectedQuestion?.options?.map((op)=> {
                return <li>{op}</li>
              })
              }</Typography>}
              
              
              <Typography>Required: {selectedQuestion.required ? "YES" : "NO"}</Typography>

              <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
                <Button 
                  variant="contained"
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
                  color="error">Delete Question</Button>
                <Button 
                  onClick={() => {
                  setQuestionUpdateModel(true)
                  setDropdownOptions(selectedQuestion.options)
                  }}
                  variant="outlined"
                  color="error">Update Question</Button>
              </Box>



           { questionUpdateModel &&
              <Dialog open={questionUpdateModel}  onClose={handleCloseUpdateQuestionModal}>
                <Paper sx={{ p: 4, width: 400, mx: "auto" }}>

                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Update Question
                  </Typography>

                  <label>Question Text</label>
                 
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
                    sx={{ mb: 2 , mt: 1}}
                  />
                  <label>Question Type</label>

                  <Select
                      value={selectedQuestion.questionType}
                      onChange={handleQuestionTypeChange}
                      displayEmpty
                      variant="outlined"
                      size="small"
                      sx={{ mb: 2, width: "100%", mt: 1 }}
                    >
                  {questionTypeOptions?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                 </Select>
                {selectedQuestion.questionType === 'dropdown' && (
                  <div>
                  <List>
                    {dropdownOptions?.length > 0 &&
                      dropdownOptions?.map((option, index) => (
                      <ListItem key={index}>
                        <TextField 
                          label={`Option ${index + 1}`} 
                          variant="outlined" 
                          fullWidth 
                          size="small" 
                          value={option} 
                          onChange={(event) => handleOptionChange(index, event)} 
                        />
                        <Button 
                          variant="outlined" 
                          color="error" 
                          sx={{ ml: 1 }}
                          size="small" 
                          onClick={() => handleRemoveOption(index)} 
                        >
                          Remove
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                  <Button 
                    variant="contained" 
                    
                    size="small"
                    onClick={handleAddOption} 
                    sx={{ mt: 1, mb: 2,  }} 
                  >
                    Add Option
                  </Button>
                </div>
                )}
                <label>Required</label>
                            <Select
                              value={selectedQuestion.required} 
                              onChange={(e) => setSelectedQuestion(
                                {
                                  ...selectedQuestion,
                                  required: e.target.value})}
                              displayEmpty
                              variant="outlined"
                              size="small"
                              sx={{ mb: 2, width: "100%" , mt: 1}}
                            >
                              <MenuItem value={false}>No</MenuItem>
                              <MenuItem value={true}>Yes</MenuItem>
                            </Select>
                            
                            <Button 
                              onClick={async() => {
                              if(selectedQuestion.questionType !== 'dropdown') {

                                setSelectedQuestion({
                                  ...selectedQuestion,
                                  options: [],
                                });
                              }
                              console.log(selectedQuestion);
                                try {
                              const response = await API.put(`/dean/question/${selectedQuestion.id}`,
                              {
                                questionText: selectedQuestion.questionText,
                                questionType: selectedQuestion.questionType,
                                options: selectedQuestion.options,
                                isRequired: selectedQuestion.required,
                              });
                              // console.log(response.data);
                              fetchQuestions();
                            
                              
                            } catch (error) {
                              console.error("Error fetching users:", error);
                            }
                              }}
                              sx={{ mt: 2, width: "100%" }}
                            variant="contained">Update</Button>
                          </Paper>
                        </Dialog>}
                      </>
                    )}
                    
        </Paper>
      </Modal>
      <Typography component="h2" variant="h6" sx={{mb: 2,  mt: 4 }}>
        Add New Question
      </Typography>
      <Paper sx={{ p: 4, width: 400, mx: "auto" }}>
        <TextField
          label="Question Text"
          variant="outlined"
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          value={selectedQuestion?.questionText || ""}
          onChange={(e) =>
        setSelectedQuestion({
          ...selectedQuestion,
          questionText: e.target.value,
        })
          }
        />
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
          sx={{ mb: 2, width: "100%" }}
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
        {selectedQuestion?.questionType === "dropdown" && (
          <div>
        <List>
          {dropdownOptions.map((option, index) => (
            <ListItem key={index}>
          <TextField
            label={`Option ${index + 1}`}
            variant="outlined"
            fullWidth
            size="small"
            value={option}
            onChange={(event) => handleOptionChange(index, event)}
          />
          <Button
            variant="outlined"
            color="error"
            sx={{ ml: 1 }}
            size="small"
            onClick={() => handleRemoveOption(index)}
          >
            Remove
          </Button>
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          size="small"
          onClick={handleAddOption}
          sx={{ mt: 1, mb: 2 }}
        >
          Add Option
        </Button>
          </div>
        )}
        <label>Required</label>
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
          sx={{ mb: 2, width: "100%", mt: 1 }}
        >
          <MenuItem value={false}>No</MenuItem>
          <MenuItem value={true}>Yes</MenuItem>
        </Select>
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
          sx={{ mt: 2, width: "100%" }}
          variant="contained"
        >
          Add Question
        </Button>
      </Paper>
      <Copyright sx={{ my: 4 }} />


    </Box>
  );
}
