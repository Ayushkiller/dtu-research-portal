import React from "react";
import {
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  IconButton,
  Button,
  Modal,
  Paper,
  Divider,
  FormControl,
  FormLabel,
  TextField,
  Select,
  MenuItem,
  Dialog,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ArticleIcon from "@mui/icons-material/Article";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

export const PaperDetailsModal = ({
  openPaperModal,
  handleClosePaperModal,
  selectedPaper,
  handleUpdateStatus,
}) => {
  return (
    <Modal 
      open={openPaperModal} 
      onClose={handleClosePaperModal}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: { xs: '95vw', sm: '90vw', md: '85vw', lg: '80vw' },
          width: '95%',
          maxHeight: '90vh',
          height: 'auto',
          borderRadius: 2,
          overflow: 'auto',
          m: 0, // Remove margins
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
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
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ mb: 0.5, color: "#1976d2" }}
              >
                Paper Title
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedPaper.paperTitle}
              </Typography>

              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ mb: 0.5, color: "#1976d2" }}
              >
                Applicant Name
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedPaper.applicantName}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 0.5, color: "#1976d2" }}
                  >
                    Department
                  </Typography>
                  <Typography variant="body1">
                    {selectedPaper.department}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 0.5, color: "#1976d2" }}
                  >
                    Publication Year
                  </Typography>
                  <Typography variant="body1">
                    {selectedPaper.pubYear}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 4 }}>
              <ArticleIcon sx={{ color: (theme) => theme.palette.primary.main, mr: 1 }} />
              <Typography variant="h6" fontWeight="600" color="primary.main">
                Research Details
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              {selectedPaper.researchPaperData.map((data, index) => (
                <Paper 
                  key={index} 
                  elevation={0}
                  sx={{ 
                    mb: 2.5, 
                    p: 2.5, 
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f8f9fa', 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: (theme) => theme.palette.divider,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(25, 118, 210, 0.08)'
                        : '#f0f7ff',
                      boxShadow: (theme) => `0 4px 8px ${theme.palette.mode === 'dark' 
                        ? 'rgba(0,0,0,0.2)'
                        : 'rgba(0,0,0,0.05)'}`
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', mb: 1.5, alignItems: 'flex-start' }}>
                    <QuestionAnswerIcon 
                      fontSize="small" 
                      sx={{ color: 'primary.main', mr: 1.5, mt: 0.2 }} 
                    />
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="600"
                      color="primary.main"
                    >
                      {data.questionText}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      ml: 4.5, 
                      padding: '10px 15px',
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'white',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: (theme) => theme.palette.divider
                    }}
                  >
                    {data.answer}
                  </Typography>
                  <Box sx={{ ml: 4.5, mt: 1.5 }}>
                    <Chip 
                      size="small" 
                      label={`Question ${index + 1}`} 
                      sx={{ 
                        bgcolor: (theme) => theme.palette.mode === 'dark' 
                          ? 'rgba(25, 118, 210, 0.15)' 
                          : '#e3f2fd', 
                        fontSize: '0.7rem',
                        color: (theme) => theme.palette.mode === 'dark' 
                          ? theme.palette.primary.light
                          : theme.palette.primary.dark
                      }} 
                    />
                  </Box>
                </Paper>
              ))}
            </Box>

            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button variant="outlined" onClick={handleClosePaperModal}>
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
  );
};

export const QuestionDetailsModal = ({
  openQuestionModal,
  handleCloseQuestionModal,
  selectedQuestion,
  setQuestionUpdateModel,
  setDropdownOptions,
  fetchQuestions,
  API,
  questionUpdateModel,
  handleCloseUpdateQuestionModal,
  questionTypeOptions,
  handleQuestionTypeChange,
  handleOptionChange,
  handleAddOption,
  handleRemoveOption,
  dropdownOptions,
  setSelectedQuestion,
  setOpenQuestionModal, // Add this line
}) => {
  return (
    <>
      <Modal open={openQuestionModal} onClose={handleCloseQuestionModal}>
        <Paper
          sx={{
            p: 4,
            maxWidth: 500,
            width: "90%",
            mx: "auto",
            my: "10%",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
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
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 0.5, color: "#1976d2" }}
                >
                  Question Text
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedQuestion.questionText}
                </Typography>

                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 0.5, color: "#1976d2" }}
                >
                  Question Type
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedQuestion.questionType}
                </Typography>

                {selectedQuestion.questionType === "dropdown" && (
                  <>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ mb: 0.5, color: "#1976d2" }}
                    >
                      Options
                    </Typography>
                    <List sx={{ bgcolor: "#f5f5f5", borderRadius: 1, mb: 2 }}>
                      {selectedQuestion?.options?.map((op, index) => (
                        <ListItem key={index}>{op}</ListItem>
                      ))}
                    </List>
                  </>
                )}

                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 0.5, color: "#1976d2" }}
                >
                  Required
                </Typography>
                <Typography variant="body1">
                  {selectedQuestion.required ? "Yes" : "No"}
                </Typography>
              </Box>

              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Typography variant="h5" component="h2">
                    Update Question
                  </Typography>
                  <IconButton
                    onClick={handleCloseUpdateQuestionModal}
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel sx={{ mb: 1, fontSize: "0.875rem" }}>
                    Question Text
                  </FormLabel>
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
                  <FormLabel sx={{ mb: 1, fontSize: "0.875rem" }}>
                    Question Type
                  </FormLabel>
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

                {selectedQuestion.questionType === "dropdown" && (
                  <Box
                    sx={{ mb: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}
                  >
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
                              onChange={(event) =>
                                handleOptionChange(index, event)
                              }
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
                  <FormLabel sx={{ mb: 1, fontSize: "0.875rem" }}>
                    Required
                  </FormLabel>
                  <Select
                    value={selectedQuestion.required}
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
                    if (selectedQuestion.questionType !== "dropdown") {
                      setSelectedQuestion({
                        ...selectedQuestion,
                        options: [],
                      });
                    }
                    try {
                      await API.put(`/dean/question/${selectedQuestion.id}`, {
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
    </>
  );
};
