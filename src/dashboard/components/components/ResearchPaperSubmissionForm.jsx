import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Box,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import API from "../../../api/axios";
import { calculateAuthorShares } from "../utils/awardDistributionUtils";
import AuthorsList from "./FormFields/AuthorsList";


const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
}));

const FormButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

export default function ResearchPaperSubmissionForm({ onSaveDraft, initialDraft = null }) {
  const [activeStep, setActiveStep] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentAuthor, setCurrentAuthor] = useState({
    name: "",
    email: "",
    isExternal: false,
    bankDetails: {
      bankName: "",
      branch: "",
      accountNo: "",
      ifscCode: "",
    },
  });
  const [editingAuthorIndex, setEditingAuthorIndex] = useState(null);
  const [authorDialogOpen, setAuthorDialogOpen] = useState(false);
  const [formData, setFormData] = useState(
    initialDraft || {
      applicantName: "",
      email: "",
      mobileNo: "",
      department: "",
      applicantType: "",
      photograph: null,
      paperDetails: {}, // Store dynamically fetched questions here
      bankDetails: {
        bankName: "",
        branch: "",
        accountNo: "",
        ifscCode: "",
      },
      isPaidJournal: "",
      paperLink: "",
      doi: "",
      totalAwardAmount: 500000,
      authors: [],
      status: "Submitted",
    }
  );

  const [questions, setQuestions] = useState([]);
  const steps = ["Personal Information", "Paper Details", "Bank Details", "Authors", "Review"];

  useEffect(() => {
    // Fetch questions for the Paper Details section
    const fetchQuestions = async () => {
      try {
        const response = await API.get("/dean/question");
        setQuestions(response.data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
        setSnackbarMessage("Failed to fetch questions.");
        setSnackbarOpen(true);
      }
    };
    fetchQuestions();
  }, []);

  const validateStep = (step) => {
    switch (step) {
      case 0: // Personal Information
        return formData.applicantName && formData.email && formData.mobileNo;
      case 1: // Paper Details
        return questions.every(
          (q) =>
            !q.isRequired || (formData.paperDetails[q._id]?.answer && formData.paperDetails[q._id]?.answer.trim() !== "")
        );
      case 2: // Bank Details
        return formData.bankDetails.bankName && formData.bankDetails.accountNo;
      case 3: // Authors
        return true; // Allow navigation even with no authors
      case 4: // Review
        return true;
      default:
        return false;
    }
  };
  // Author Management Methods
  const openAuthorDialog = () => {
    setCurrentAuthor({
      name: "",
      email: "",
      isExternal: false,
      bankDetails: {
        bankName: "",
        branch: "",
        accountNo: "",
        ifscCode: "",
      },
    });
    setEditingAuthorIndex(null);
    setAuthorDialogOpen(true);
  };

  const handleAuthorChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedAuthor = {
      ...currentAuthor,
      [name]: type === "checkbox" ? checked : value,
    };

    // Handle nested bank details
    if (name.startsWith("bankDetails.")) {
      const bankDetailKey = name.split(".")[1];
      updatedAuthor.bankDetails = {
        ...currentAuthor.bankDetails,
        [bankDetailKey]: value,
      };
    }

    setCurrentAuthor(updatedAuthor);
  };
  const saveAuthor = () => {
    const updatedAuthors = [...formData.authors];

    if (editingAuthorIndex !== null) {
      // Editing existing author
      updatedAuthors[editingAuthorIndex] = currentAuthor;
    } else {
      // Adding new author
      updatedAuthors.push(currentAuthor);
    }

    setFormData((prev) => ({
      ...prev,
      authors: updatedAuthors,
    }));

    setAuthorDialogOpen(false);
  };
  const editAuthor = (index) => {
    setCurrentAuthor(formData.authors[index]);
    setEditingAuthorIndex(index);
    setAuthorDialogOpen(true);
  };

  const removeAuthor = (index) => {
    const updatedAuthors = formData.authors.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      authors: updatedAuthors,
    }));
  };

  const handleNext = () => {
    // Only move to the next step if validation passes
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 1) {
        // If it's the last step, don't increment step, let the Submit button handle the form submission
        setActiveStep((prev) => prev);
      } else {
        setActiveStep((prev) => prev + 1);
      }
    } else {
      setSnackbarMessage("Please fill in all required fields for this step.");
      setSnackbarOpen(true);
    }
  };
  

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Find the question using the name (which is the question ID)
    const question = questions.find((q) => q._id === name);
  
    setFormData((prev) => ({
      ...prev,
      paperDetails: {
        ...prev.paperDetails,
        [name]: {
          answer: value,       // Store the answer
          questionText: question?.questionText || "",  // Store the question text
        },
      },
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the form data to the backend
      console.log("Form data:", formData);
      console.log(questions)
      const response = await API.post("/research-paper-submission", formData);

      setSnackbarMessage("Form submitted successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to submit the form:", error);
      setSnackbarMessage("Failed to submit the form.");
      setSnackbarOpen(true);
    }
  };

  
  useEffect(() => {
    if (formData.authors.length > 0 && formData.totalAwardAmount > 0) {
      const authorShares = calculateAuthorShares(
        formData.authors,
        formData.totalAwardAmount
      );
      setFormData((prev) => ({
        ...prev,
        authors: prev.authors.map((author, index) => ({
          ...author,
          shareValue: authorShares[index].shareValue,
          amount: authorShares[index].amount,
        })),
      }));
    }
  }, [formData.authors, formData.totalAwardAmount]);


  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Applicant Name"
                value={formData.applicantName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, applicantName: e.target.value }))
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                value={formData.mobileNo}
                onChange={(e) => setFormData((prev) => ({ ...prev, mobileNo: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Applicant Type"
                value={formData.applicantType}
                onChange={(e) => setFormData((prev) => ({ ...prev, applicantType: e.target.value }))}
                required
              />
            </Grid>
            {/* Additional fields as needed */}
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            {questions.map((question) => (
              <Grid item xs={12} sm={6} key={question._id}>
                <TextField
                  fullWidth
                  label={question.questionText}
                  name={question._id}
                  value={formData.paperDetails[question._id]?.answer || ""}
                  onChange={handleChange}
                  required={question.isRequired}
                />
              </Grid>
            ))}
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bank Name"
                value={formData.bankDetails.bankName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bankDetails: { ...prev.bankDetails, bankName: e.target.value },
                  }))
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Branch"
                name="bankDetails.branch"
                value={formData.bankDetails.branch}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bankDetails: { ...prev.bankDetails, branch: e.target.value },
                  }))
                }
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Account Number"
                value={formData.bankDetails.accountNo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bankDetails: { ...prev.bankDetails, accountNo: e.target.value },
                  }))
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
               fullWidth
                label="IFSC Code"
                name="bankDetails.ifscCode"
                value={formData.bankDetails.ifscCode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bankDetails: { ...prev.bankDetails, ifscCode: e.target.value },
                  }))
                }
                required
              />
            </Grid>
            {/* Additional fields as needed */}
          </Grid>
        );
      case 3:
        return (
          <>
          
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Authors</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={openAuthorDialog}
                >
                  Add New Author
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <AuthorsList
                authors={formData.authors}
                editable
                onEditAuthor={editAuthor}
                onRemoveAuthor={removeAuthor}
              />
            </Grid>
             {/* Author Dialog */}
      <Dialog
        open={authorDialogOpen}
        onClose={() => setAuthorDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingAuthorIndex !== null ? "Edit Author" : "Add New Author"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Author Name"
                name="name"
                value={currentAuthor.name}
                onChange={handleAuthorChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={currentAuthor.email}
                onChange={handleAuthorChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={currentAuthor.isExternal}
                    onChange={handleAuthorChange}
                    name="isExternal"
                  />
                }
                label="External Author"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bank Name"
                name="bankDetails.bankName"
                value={currentAuthor.bankDetails.bankName}
                onChange={handleAuthorChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Branch"
                name="bankDetails.branch"
                value={currentAuthor.bankDetails.branch}
                onChange={handleAuthorChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account Number"
                name="bankDetails.accountNo"
                value={currentAuthor.bankDetails.accountNo}
                onChange={handleAuthorChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="IFSC Code"
                name="bankDetails.ifscCode"
                value={currentAuthor.bankDetails.ifscCode}
                onChange={handleAuthorChange}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAuthorDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={saveAuthor} color="primary" variant="contained">
            Save Author
          </Button>
        </DialogActions>
      </Dialog>
            </>

        );
      case 4:
        return (
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Review Your Submission</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Personal Information</Typography>
              <Typography>Name: {formData.applicantName}</Typography>
              <Typography>Email: {formData.email}</Typography>
              <Typography>Mobile No: {formData.mobileNo}</Typography>
              <Typography>Department: {formData.department}</Typography>
              <Typography>Applicant Type: {formData.applicantType}</Typography>
            </Grid>
            <Grid item xs={12}>
              {questions.map((question) => (
              <Typography>{question.questionText}: {formData.paperDetails[question._id]?.answer}</Typography>
              
            ))}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Authors</Typography>
              <AuthorsList authors={formData.authors} editable={false} />
            </Grid>
          </Grid>
        )// Review implementation
      default:
        return "Unknown step";
    }
  };

  return (
    <Container maxWidth="md">
      <StyledPaper elevation={3}>
        <Typography variant="h4" align="center" gutterBottom>
          Research Paper Submission
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form >
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {renderStepContent(activeStep)}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Box>
              <FormButton disabled={activeStep === 0} onClick={handleBack} variant="outlined">
                Back
              </FormButton>
              <FormButton variant="outlined" color="secondary" onClick={onSaveDraft}>
                Save Draft
              </FormButton>
            </Box>
            {activeStep === steps.length - 1 ? (
              <FormButton onClick={handleSubmit} variant="contained" color="primary">
                Submit
              </FormButton>
            ) : (
              <FormButton variant="contained" color="primary" onClick={handleNext}>
                Next
              </FormButton>
            )}
          </Box>
        </form>
      </StyledPaper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Container>
  );
}
