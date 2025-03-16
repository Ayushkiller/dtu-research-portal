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
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Tooltip,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import API from "../../../api/axios";
import { calculateAuthorShares, AWARD_CATEGORIES } from "../utils/awardDistributionUtils";
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
      paperTitle: "",
      pubYear: "",
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
      awardCategory: "OUTSTANDING", // Default to Outstanding Research Award
      totalAwardAmount: AWARD_CATEGORIES.OUTSTANDING.amount,
      authors: [],
      zFactor: 1, // Default Z factor is 1 (max)
    }
  );

  const [questions, setQuestions] = useState([]);
  const steps = ["Paper & Authors", "Review"];

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

  // New effect to add applicant as an internal author if not already added
  useEffect(() => {
    // Check if form has been initialized with applicant data
    if (formData.applicantName && formData.email) {
      // Check if the applicant is already in the authors list
      const applicantExists = formData.authors.some(
        author => author.email === formData.email
      );
      
      // If not, add them as an internal author
      if (!applicantExists) {
        const applicantAuthor = {
          name: formData.applicantName,
          email: formData.email,
          isExternal: false, // Applicant is always internal
          bankDetails: {
            ...formData.bankDetails
          },
          confirmationToken: {
            token: Math.random().toString(36).substring(2, 12),
          }
        };
        
        setFormData(prev => ({
          ...prev,
          authors: [...prev.authors, applicantAuthor]
        }));
      }
    }
  }, [formData.applicantName, formData.email, formData.bankDetails.bankName]);

  const validateStep = (step) => {
    switch (step) {
      case 0: // Paper Details
        return questions.every(
          (q) =>
            !q.isRequired || (formData.paperDetails[q._id]?.answer && formData.paperDetails[q._id]?.answer.trim() !== "")
        );
      case 1: // Authors
        return true; // Allow navigation even with no authors
      case 2: // Review
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
      // Ensure applicant is included as an author
      const applicantExists = formData.authors.some(
        author => author.email === formData.email
      );
      
      if (!applicantExists && formData.applicantName && formData.email) {
        setSnackbarMessage("You must include yourself as an author. Please add your details to the authors list.");
        setSnackbarOpen(true);
        return;
      }

      // Continue with form submission
      console.log("Form data:", formData);
      console.log(questions)
      if(formData.authors.length === 0){
        formData.status = "Submitted"
        setSnackbarMessage("Form submitted successfully!");
        setSnackbarOpen(true);
        return
      }
      const response = await API.post("/research-paper-submission", formData);


      console.log(response.data.data._id);
      const researchPaperId = response?.data?.data?._id;
      console.log(researchPaperId);

      authorSendEmail(researchPaperId, formData.authors);
      setSnackbarMessage("Form submitted successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to submit the form:", error);
      setSnackbarMessage("Failed to submit the form.");
      setSnackbarOpen(true);
    }
  };

  const authorSendEmail = async (id, authors) => {
    try {
      // Send the form data to the backend
      
      const authorEmailData = authors.map((author) => ({
        name: author.name,
        email: author.email,
        token: author.confirmationToken.token,
      }));
      const response = await API.post("/research-author-email/send", {
        authors: authorEmailData,
        paperTitle : formData.paperDetails[questions[0]._id]?.answer,
        submissionId : id,
      });

      setSnackbarMessage("Emails sent successfully!");
      console.log(response.results)
      
    } catch (error) {
      console.log(error)
    }
  }

  
  useEffect(() => {
    if (formData.authors.length > 0 && formData.totalAwardAmount > 0) {
      const authorShares = calculateAuthorShares(
        formData.authors,
        formData.totalAwardAmount,
        formData.zFactor // Pass the Z factor
      );
      setFormData((prev) => ({
        ...prev,
        authors: prev.authors.map((author, index) => ({
          ...author,
          shareValue: authorShares[index].shareValue,
          amount: authorShares[index].amount,
          confirmationToken :{
            token : Math.random().toString(36).substring(2, 12),
          }
        })),
      }));
    }
  }, [formData.authors, formData.totalAwardAmount, formData.zFactor]);

  const handleAwardCategoryChange = (e) => {
    const category = e.target.value;
    setFormData((prev) => ({
      ...prev,
      awardCategory: category,
      totalAwardAmount: AWARD_CATEGORIES[category].amount,
    }));
  };

  // Add handler for Z factor changes
  const handleZFactorChange = (e) => {
    const zFactor = parseFloat(e.target.value);
    setFormData((prev) => ({
      ...prev,
      zFactor: zFactor,
    }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Grid container spacing={2}>
              {/* Award Category Selection */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Award Category</Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    name="awardCategory"
                    value={formData.awardCategory}
                    onChange={handleAwardCategoryChange}
                  >
                    {Object.values(AWARD_CATEGORIES).map((category) => (
                      <Card 
                        key={category.value} 
                        variant="outlined" 
                        sx={{ 
                          mb: 2, 
                          border: formData.awardCategory === category.value ? 
                                 '2px solid #3f51b5' : '1px solid rgba(0, 0, 0, 0.12)'
                        }}
                      >
                        <CardContent>
                          <FormControlLabel
                            value={category.value}
                            control={<Radio />}
                            label={
                              <Box>
                                <Typography variant="subtitle1" component="span">
                                  {category.label} - ₹{category.amount.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                  {category.description}
                                </Typography>
                                <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                                  Criteria: {category.criteria}
                                </Typography>
                              </Box>
                            }
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Paper Title"
                  value={formData.paperTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, paperTitle: e.target.value }))}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Publication Year"
                  value={formData.pubYear}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, pubYear: e.target.value }))
                  }
                  required
                />
              </Grid>

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

              {/* Add Z Factor slider */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Contribution Factor (Z): {formData.zFactor.toFixed(2)}
                </Typography>
                <Tooltip title="Z factor determines how the total award is distributed. Higher values distribute more evenly." placement="top">
                  <Box sx={{ width: '100%' }}>
                    <input
                      type="range"
                      min="0.5"
                      max="1"
                      step="0.01"
                      value={formData.zFactor}
                      onChange={handleZFactorChange}
                      style={{ width: '100%' }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption">0.5 (Minimum)</Typography>
                      <Typography variant="caption">1.0 (Maximum)</Typography>
                    </Box>
                  </Box>
                </Tooltip>
              </Grid>
            </Grid>

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
      case 1:
        return (
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Review Your Submission</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Award Category:</strong> {AWARD_CATEGORIES[formData.awardCategory].label} - 
                ₹{formData.totalAwardAmount.toLocaleString()}
              </Typography>
              {questions.map((question) => (
              <Typography>{question.questionText}: {formData.paperDetails[question._id]?.answer}</Typography>
              
            ))}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Authors</Typography>
              <AuthorsList authors={formData.authors} editable={false} />
              {formData.authors.length > 0 && formData.awardCategory === "COMMENDABLE" && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Note: An author can claim the Commendable Research Award for a maximum of three papers per year.
                </Typography>
              )}
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
