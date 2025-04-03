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
  Divider,
  TextField,
  Tooltip,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import API from "../../../api/axios";
import {
  calculateAuthorShares,
  AWARD_CATEGORIES,
} from "../utils/awardDistributionUtils";
import AuthorsList from "./FormFields/AuthorsList";
import InfoIcon from "@mui/icons-material/Info";
import PaperDetailsForm from "./PaperDetailsForm";
import AwardCategorySelection from "./AwardCategorySelection";
import AuthorDialog from "./AuthorDialog";
import ReviewStep from "./ReviewStep";

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
  onSaveDraft,
  initialDraft = null,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [user, setUser] = useState(null);

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
      bankDetails: {
        bankName: "",
        branch: "",
        accountNo: "",
        ifscCode: "",
      },
      awardCategory: "OUTSTANDING",
      totalAwardAmount: AWARD_CATEGORIES.OUTSTANDING.amount,
      authors: [],
      zFactor: 1,
      journalName: "",
      authorType: "",
      impactFactor: "",
      indexing: "",
      volumeNo: "",
      pageNo: "",
      year: "",
      publisher: "",
      isPaidJournal: "",
      paperLink: "",
      doi: "",
      hasMorePapers: "",
      isEligible: "",
    }
  );

  const steps = ["Paper & Authors", "Review"];

  const fetchUser = async () => {
    try {
      const response = await API.get("/user/me");
      setUser(response.data);
      setFormData((prev) => ({
        ...prev,
        applicantName: response.data.name,
        email: response.data.email,
        mobileNo: response.data.mobileNumber,
        department: response.data.department,
        applicantType: response.data.userType,
        applicantBiography: response.data.applicantBiography,
        employeeId: response.data.employeeId,
        photograph: response.data.applicantPhoto,
        bankDetails: {
          bankName: response.data.bankName || "",
          branch: response.data.branchName || "",
          accountNo: response.data.bankAccount || "",
          ifscCode: response.data.ifsc || "",
        },
      }));
    } catch (error) {
      setSnackbarMessage("Failed to fetch user.");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (formData.applicantName && formData.email) {
      const applicantExists = formData.authors.some(
        (author) => author.email === formData.email
      );
      if (!applicantExists) {
        const applicantAuthor = {
          name: formData.applicantName,
          email: formData.email,
          isExternal: false,
          bankDetails: { ...formData.bankDetails },
          confirmationToken: {
            token: Math.random().toString(36).substring(2, 12),
          },
        };
        setFormData((prev) => ({
          ...prev,
          authors: [...prev.authors, applicantAuthor],
        }));
      }
    }
  }, [formData.applicantName, formData.email, formData.bankDetails.bankName]);

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return true;
      default:
        return false;
    }
  };

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
      updatedAuthors[editingAuthorIndex] = currentAuthor;
    } else {
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
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 1) {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const totalShares = formData.authors.reduce(
        (sum, author) => sum + (author.shareValue || 0),
        0
      );
      if (Math.round(totalShares) !== 100) {
        setSnackbarMessage(
          "Total share distribution must equal 100%. Please adjust the shares before submitting."
        );
        setSnackbarOpen(true);
        return;
      }
      const applicantExists = formData.authors.some(
        (author) => author.email === formData.email
      );
      if (!applicantExists && formData.applicantName && formData.email) {
        setSnackbarMessage(
          "You must include yourself as an author. Please add your details to the authors list."
        );
        setSnackbarOpen(true);
        return;
      }
      const formDataToSubmit = {
        ...formData,
        authors: formData.authors.map((author) => {
          const {
            "bankDetails.bankName": bankName,
            "bankDetails.branch": branch,
            "bankDetails.accountNo": accountNo,
            "bankDetails.ifscCode": ifscCode,
            ...rest
          } = author;
          return {
            ...rest,
            bankDetails: {
              bankName: author.bankDetails.bankName || bankName || "",
              branch: author.bankDetails.branch || branch || "",
              accountNo: author.bankDetails.accountNo || accountNo || "",
              ifscCode: author.bankDetails.ifscCode || ifscCode || "",
            },
          };
        }),
      };
      if (
        formDataToSubmit.authors.length === 1 &&
        formDataToSubmit.authors[0].name === formDataToSubmit.applicantName
      ) {
        formDataToSubmit.status = "Submitted";
        setSnackbarMessage("Form submitted successfully!");
        setSnackbarOpen(true);
        return;
      }
      if (
        formDataToSubmit.authors.length > 1 &&
        formDataToSubmit.authors[0].name === formDataToSubmit.applicantName
      ) {
        formDataToSubmit.authors[0].confirmationStatus = true;
        formDataToSubmit.authors[0].confirmationToken.used = true;
      }
      const response = await API.post(
        "/research-paper-submission",
        formDataToSubmit
      );
      const researchPaperId = response?.data?.data?._id;
      authorSendEmail(researchPaperId, formDataToSubmit.authors);
      setSnackbarMessage("Form submitted successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to submit the form.");
      setSnackbarOpen(true);
    }
  };

  const authorSendEmail = async (id, authors) => {
    try {
      const filteredAuthors = authors.filter(
        (author) =>
          author.name !== formData.applicantName &&
          author.isExternal === false &&
          author.email !== formData.email
      );
      const authorEmailData = filteredAuthors.map((author) => ({
        name: author.name,
        email: author.email,
        token: author.confirmationToken.token,
      }));
      await API.post("/research-author-email/send", {
        authors: authorEmailData,
        paperTitle: formData.paperTitle,
        submissionId: id,
      });
      setSnackbarMessage("Emails sent successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleManualShareUpdate = (updatedAuthors) => {
    setFormData((prev) => ({
      ...prev,
      authors: updatedAuthors,
    }));
  };

  useEffect(() => {
    if (formData.authors.length > 0 && formData.totalAwardAmount > 0) {
      const authorShares = calculateAuthorShares(
        formData.authors,
        formData.totalAwardAmount,
        formData.zFactor
      );
      setFormData((prev) => ({
        ...prev,
        authors: prev.authors.map((author, index) => ({
          ...author,
          shareValue: authorShares[index].shareValue,
          amount: authorShares[index].amount,
          calculatedMinShare: authorShares[index].shareValue * 0.5,
          confirmationToken: author.confirmationToken || {
            token: Math.random().toString(36).substring(2, 12),
          },
        })),
      }));
    }
  }, [formData.authors.length, formData.totalAwardAmount, formData.zFactor]);

  const handleAwardCategoryChange = (e) => {
    const category = e.target.value;
    setFormData((prev) => ({
      ...prev,
      awardCategory: category,
      totalAwardAmount: AWARD_CATEGORIES[category].amount,
    }));
  };

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
              <Grid item xs={12}>
                <AwardCategorySelection
                  awardCategory={formData.awardCategory}
                  handleAwardCategoryChange={handleAwardCategoryChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <InputLabel>Paper Title</InputLabel>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={formData.paperTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      paperTitle: e.target.value,
                    }))
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>Publication Year</InputLabel>
                <TextField
                  fullWidth
                  value={formData.pubYear}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pubYear: e.target.value,
                    }))
                  }
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Paper Details
                </Typography>
              </Grid>

              <PaperDetailsForm
                formData={formData}
                handleInputChange={handleInputChange}
              />

              <Grid item xs={12}>
                <Tooltip
                  title={
                    <Box>
                      <Typography variant="body2" gutterBottom>
                        Z factor determines how the total award is distributed:
                      </Typography>
                      <Typography variant="body2">
                        • Higher Z (1.0): More equal distribution among authors
                      </Typography>
                      <Typography variant="body2">
                        • Lower Z (0.5): Rewards first authors more than others
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        You can also manually adjust shares after setting this
                        value.
                      </Typography>
                    </Box>
                  }
                  placement="top"
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Contribution Factor (Z): {formData.zFactor.toFixed(2)}
                    </Typography>
                    <InfoIcon fontSize="small" color="action" sx={{ ml: 1 }} />
                  </Box>
                </Tooltip>
                <Box sx={{ width: "100%" }}>
                  <input
                    type="range"
                    min="0.5"
                    max="1"
                    step="0.01"
                    value={formData.zFactor}
                    onChange={handleZFactorChange}
                    style={{ width: "100%" }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography variant="caption">0.5 (Minimum)</Typography>
                    <Typography variant="caption">1.0 (Maximum)</Typography>
                  </Box>
                </Box>
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
                totalAwardAmount={formData.totalAwardAmount}
                onUpdateShareValues={handleManualShareUpdate}
              />
            </Grid>
            <AuthorDialog
              open={authorDialogOpen}
              onClose={() => setAuthorDialogOpen(false)}
              currentAuthor={currentAuthor}
              handleAuthorChange={handleAuthorChange}
              saveAuthor={saveAuthor}
              editingAuthorIndex={editingAuthorIndex}
            />
          </>
        );
      case 1:
        return (
          <ReviewStep formData={formData} AWARD_CATEGORIES={AWARD_CATEGORIES} />
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

        <form>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {renderStepContent(activeStep)}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Box>
              <FormButton
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </FormButton>
              <FormButton
                variant="outlined"
                color="secondary"
                onClick={onSaveDraft}
              >
                Save Draft
              </FormButton>
            </Box>
            {activeStep === steps.length - 1 ? (
              <FormButton
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
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
    </Container>
  );
}
