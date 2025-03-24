import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  FormControl,
  FormLabel,
  TextField,
  Select,
  MenuItem,
  List,
  ListItem,
  IconButton,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export const QuestionManagement = ({
  questions,
  questionColumns,
  handleQuestionRowClick,
  selectedQuestion,
  setSelectedQuestion,
  dropdownOptions,
  setDropdownOptions,
  questionTypeOptions,
  handleQuestionTypeChange,
  handleOptionChange,
  handleAddOption,
  handleRemoveOption,
  fetchQuestions,
  API,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography
        component="h2"
        variant="h5"
        sx={{ mb: 3, fontWeight: "medium", color: "#1976d2" }}
      >
        Question Management
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={questions}
              columns={questionColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              onRowClick={handleQuestionRowClick}
              sx={{
                "& .MuiDataGrid-cell:hover": { color: "primary.main" },
                border: "none",
                borderRadius: 2,
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              component="h3"
              variant="h6"
              sx={{ mb: 2, color: "#1976d2" }}
            >
              Add New Question
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel sx={{ mb: 1, fontSize: "0.875rem" }}>
                Question Text
              </FormLabel>
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
              <FormLabel sx={{ mb: 1, fontSize: "0.875rem" }}>
                Question Type
              </FormLabel>
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
              <Box sx={{ mb: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
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
              <FormLabel sx={{ mb: 1, fontSize: "0.875rem" }}>
                Required
              </FormLabel>
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
  );
};
