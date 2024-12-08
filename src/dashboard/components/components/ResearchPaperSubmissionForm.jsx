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
import { calculateAuthorShares } from "../utils/awardDistributionUtils";
import PersonalInformation from "./FormFields/PersonalInformation";
import PaperDetails from "./FormFields/PaperDetails";
import BankDetails from "./FormFields/BankDetails";
import AuthorsList from "./FormFields/AuthorsList";
import API from "../../../api/axios";
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
}));

const FormButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

export default function ResearchPaperSubmissionForm({
    onSubmit,
    onSaveDraft,
    initialDraft = null,
  }) {
    const [activeStep, setActiveStep] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [authorDialogOpen, setAuthorDialogOpen] = useState(false);
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
  
    // Initialize form data with draft if available
    const [formData, setFormData] = useState(
      initialDraft || {
        applicantName: "",
        email: "",
        mobileNo: "",
        department: "",
        applicantType: "",
        photograph: null,
        biography: "",
        paperTitle: "",
        journalName: "",
        authorType: "",
        impactFactor: "",
        indexing: "",
        volumeNo: "",
        pageNo: "",
        publicationYear: "",
        publisher: "",
        bankDetails: {
          bankName: "",
          branch: "",
          accountNo: "",
          ifscCode: "",
        },
        isPaidJournal: "",
        paperLink: "",
        doi: "",
        totalAwardAmount: 900000,
        authors: [],
        status: "draft",
      }
    );
  
    const steps = [
      "Personal Information",
      "Paper Details",
      "Bank Details",
      "Authors",
      "Review",
    ];
    const validateStep = (step) => {
        switch (step) {
          case 0: // Personal Information
            return formData.applicantName && formData.email && formData.mobileNo;
          case 1: // Paper Details
            return (
              formData.paperTitle &&
              formData.journalName &&
              formData.publicationYear
            );
          case 2: // Bank Details
            return formData.bankDetails.bankName && formData.bankDetails.accountNo;
          case 3: // Authors
            // Allow navigation even with no authors
            return true;
          case 4: // Review
            return true;
          default:
            return false;
        }
      };
    

      const handleNext = () => {
        if (validateStep(activeStep)) {
          // Check if we're currently on the last step before review
          if (activeStep === steps.length - 2) {
            // Move to the review step
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          } else {
            // For all other steps, move to the next step
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          }
        } else {
          setSnackbarMessage("Please fill in all required fields for this step.");
          setSnackbarOpen(true);
        }
      };
    
      const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      };
    
      const handleSaveDraft = () => {
        if (onSaveDraft) {
          onSaveDraft(formData);
          setSnackbarMessage("Draft saved successfully!");
          setSnackbarOpen(true);
        }
      };
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        const [field, subField] = name.split(".");
    
        if (subField) {
          setFormData((prev) => ({
            ...prev,
            [field]: {
              ...prev[field],
              [subField]: value,
            },
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await API.post("/research-paper-submission", formData);
          setSnackbarMessage("Research paper submitted successfully!");
          setSnackbarOpen(true);
          if (onSubmit) {
            onSubmit(response.data);
          }
        } catch (error) {
          setSnackbarMessage("Error submitting research paper.");
          setSnackbarOpen(true);
          console.error("Error submitting research paper:", error);
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
          <PersonalInformation
            formData={formData}
            handleChange={handleChange}
          />
        );
      case 1:
        return <PaperDetails formData={formData} handleChange={handleChange} />;
      case 2:
        return <BankDetails formData={formData} handleChange={handleChange} />;
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
              <Typography variant="subtitle1">Paper Details</Typography>
              <Typography>Paper Title: {formData.paperTitle}</Typography>
              <Typography>Journal Name: {formData.journalName}</Typography>
              <Typography>Author Type: {formData.authorType}</Typography>
              <Typography>Impact Factor: {formData.impactFactor}</Typography>
              <Typography>Indexing: {formData.indexing}</Typography>
              <Typography>Volume No: {formData.volumeNo}</Typography>
              <Typography>Page No: {formData.pageNo}</Typography>
              <Typography>
                Publication Year: {formData.publicationYear}
              </Typography>
              <Typography>Publisher: {formData.publisher}</Typography>
              <Typography>Is Paid Journal: {formData.isPaidJournal}</Typography>
              <Typography>Paper Link: {formData.paperLink}</Typography>
              <Typography>DOI: {formData.doi}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Authors</Typography>
              <AuthorsList authors={formData.authors} editable={false} />
            </Grid>
          </Grid>
        );
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

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {renderStepContent(activeStep)}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Box>
              <FormButton
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                sx={{ mr: 2 }}
              >
                Back
              </FormButton>
              <FormButton
                variant="outlined"
                color="secondary"
                onClick={handleSaveDraft}
              >
                Save Draft
              </FormButton>
            </Box>
            {activeStep === steps.length   ? (
              <FormButton type="submit" variant="contained" color="primary">
                Submit
              </FormButton>
            ) : (
              <FormButton
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
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
    </Container>
  );
}
