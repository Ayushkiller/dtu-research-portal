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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

export const PaperDetailsModal = ({
  openPaperModal,
  handleClosePaperModal,
  selectedPaper,
  handleUpdateStatus,
}) => {
  return (
    <Modal open={openPaperModal} onClose={handleClosePaperModal}>
      <Paper
        sx={{
          p: 4,
          maxWidth: 600,
          width: "90%",
          mx: "auto",
          my: "5%",
          borderRadius: 2,
          maxHeight: "80vh",
          overflow: "auto",
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

            <Typography variant="h6" sx={{ mb: 2 }}>
              Research Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 3 }}>
              {selectedPaper.researchPaperData.map((data, index) => (
                <Box
                  key={index}
                  sx={{ mb: 2, p: 2, bgcolor: "#f8f9fa", borderRadius: 1 }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    {data.questionText}
                  </Typography>
                  <Typography variant="body1">{data.answer}</Typography>
                </Box>
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
