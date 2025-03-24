import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import API from "../../api/axios";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  maxWidth: "800px",
  maxHeight: "90vh",
  overflowY: "auto",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "80%",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  maxWidth: "100%",
}));

const StyledFormSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
}));

const steps = ['Personal Information', 'Academic Details', 'Banking Information', 'Set Password'];

export default function SignUp(props) {
  const [activeStep, setActiveStep] = useState(0);
  const [formErrors, setFormErrors] = useState({
    email: { error: false, message: "" },
    password: { error: false, message: "" },
    confirmPassword: { error: false, message: "" },
    name: { error: false, message: "" },
    terms: { error: false, message: "" },
    dateOfBirth: { error: false, message: "" },
    address: { error: false, message: "" },
    bankAccount: { error: false, message: "" },
    bankName: { error: false, message: "" },
    branchName: { error: false, message: "" },
    ifsc: { error: false, message: "" },
    accountHolderName: { error: false, message: "" },
    mobileNumber: { error: false, message: "" },
    employeeId: { error: false, message: "" },
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({});

  const validateInputs = (step) => {
    let isValid = true;
    let newErrors = { ...formErrors };

    // Personal Information (Step 0)
    if (step === 0 || step === -1) {
      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const dateOfBirth = document.getElementById("dateOfBirth");
      const address = document.getElementById("address");
      const mobileNumber = document.getElementById("mobileNumber");

      if (!name || !name.value || name.value.length < 2) {
        newErrors.name = {
          error: true,
          message: "Please enter your full name (at least 2 characters)"
        };
        isValid = false;
      } else {
        newErrors.name = { error: false, message: "" };
      }

      if (!email || !email.value || !/\S+@dtu\.ac\.in$/.test(email.value)) {
        newErrors.email = {
          error: true,
          message: "Please enter a valid DTU email address"
        };
        isValid = false;
      } else {
        newErrors.email = { error: false, message: "" };
      }

      if (!dateOfBirth || !dateOfBirth.value) {
        newErrors.dateOfBirth = {
          error: true,
          message: "Date of birth is required"
        };
        isValid = false;
      } else {
        newErrors.dateOfBirth = { error: false, message: "" };
      }

      if (!address || !address.value || address.value.length < 5) {
        newErrors.address = {
          error: true,
          message: "Please enter a valid address"
        };
        isValid = false;
      } else {
        newErrors.address = { error: false, message: "" };
      }

      if (!mobileNumber || !mobileNumber.value || !/^\d{10}$/.test(mobileNumber.value)) {
        newErrors.mobileNumber = {
          error: true,
          message: "Please enter a valid 10-digit mobile number"
        };
        isValid = false;
      } else {
        newErrors.mobileNumber = { error: false, message: "" };
      }

      if (!isValid && step !== -1) {
        setFormErrors(newErrors);
        return false;
      }
    }

    // Academic Details (Step 1)
    if (step === 1 || step === -1) {
      const employeeId = document.getElementById("employeeId");

      if (!employeeId || !employeeId.value) {
        newErrors.employeeId = {
          error: true,
          message: "ID/Roll number is required"
        };
        isValid = false;
      } else {
        newErrors.employeeId = { error: false, message: "" };
      }

      if (!isValid && step !== -1) {
        setFormErrors(newErrors);
        return false;
      }
    }

    // Banking Information (Step 2)
    if (step === 2 || step === -1) {
      const bankAccount = document.getElementById("bankAccount");
      const bankName = document.getElementById("bankName");
      const branchName = document.getElementById("branchName");
      const ifsc = document.getElementById("ifsc");
      const accountHolderName = document.getElementById("accountHolderName");

      if (!bankAccount || !bankAccount.value) {
        newErrors.bankAccount = {
          error: true,
          message: "Bank account number is required"
        };
        isValid = false;
      } else {
        newErrors.bankAccount = { error: false, message: "" };
      }

      if (!bankName || !bankName.value) {
        newErrors.bankName = {
          error: true,
          message: "Bank name is required"
        };
        isValid = false;
      } else {
        newErrors.bankName = { error: false, message: "" };
      }

      if (!branchName || !branchName.value) {
        newErrors.branchName = {
          error: true,
          message: "Branch name is required"
        };
        isValid = false;
      } else {
        newErrors.branchName = { error: false, message: "" };
      }

      if (!ifsc || !ifsc.value) {
        newErrors.ifsc = {
          error: true,
          message: "IFSC code is required"
        };
        isValid = false;
      } else {
        newErrors.ifsc = { error: false, message: "" };
      }

      if (!accountHolderName || !accountHolderName.value) {
        newErrors.accountHolderName = {
          error: true,
          message: "Account holder name is required"
        };
        isValid = false;
      } else {
        newErrors.accountHolderName = { error: false, message: "" };
      }

      if (!isValid && step !== -1) {
        setFormErrors(newErrors);
        return false;
      }
    }

    // Password (Step 3)
    if (step === 3 || step === -1) {
      const password = document.getElementById("password");
      const confirmPassword = document.getElementById("confirmPassword");
      const terms = document.getElementById("terms");

      if (
        !password ||
        !password.value ||
        password.value.length < 8 ||
        !/[A-Za-z]/.test(password.value) ||
        !/\d/.test(password.value) ||
        !/[!@#$%^&*]/.test(password.value)
      ) {
        newErrors.password = {
          error: true,
          message: "Password must be at least 8 characters with letters, numbers, and symbols"
        };
        isValid = false;
      } else {
        newErrors.password = { error: false, message: "" };
      }

      if (!confirmPassword || !confirmPassword.value || password.value !== confirmPassword.value) {
        newErrors.confirmPassword = {
          error: true,
          message: "Passwords do not match"
        };
        isValid = false;
      } else {
        newErrors.confirmPassword = { error: false, message: "" };
      }

      if (!terms || !terms.checked) {
        newErrors.terms = { error: true, message: "You must agree to the terms" };
        isValid = false;
      } else {
        newErrors.terms = { error: false, message: "" };
      }

      if (!isValid && step !== -1) {
        setFormErrors(newErrors);
        return false;
      }
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const collectFormData = () => {
    const form = document.getElementById("signupForm");
    const formData = new FormData(form);
    
    return {
      name: formData.get("name"),
      email: formData.get("email"),
      userType: formData.get("userType"),
      employeeId: formData.get("employeeId"),
      department: formData.get("department"),
      mobileNumber: formData.get("mobileNumber"),
      password: formData.get("password"),
      dateOfBirth: formData.get("dateOfBirth"),
      address: formData.get("address"),
      bankAccount: formData.get("bankAccount"),
      bankName: formData.get("bankName"),
      branchName: formData.get("branchName"),
      ifsc: formData.get("ifsc"),
      accountHolderName: formData.get("accountHolderName"),
    };
  };

  const handleNext = () => {
    if (validateInputs(activeStep)) {
      const newData = collectFormData();
      setFormData({ ...formData, ...newData });
      
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateInputs(-1)) {
      return;
    }

    const userData = collectFormData();
    setFormSubmitted(true);

    try {
      const response = await API.post("/auth/register", userData);
      console.log(response.data);
      alert("User registered successfully!");
      // Redirect to login page or show success message
    } catch (error) {
      console.error("Error registering user:", error);
      setFormSubmitted(false);
      alert("Failed to register user. Please try again.");
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <img
              src="/logo.png"
              alt="DTU Logo"
              style={{ height: 60, width: 60, marginRight: 16 }}
            />
            <Typography
              component="h1"
              variant="h4"
              sx={{ fontWeight: 600 }}
            >
              DTU Research Portal
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box
            component="form"
            id="signupForm"
            onSubmit={(e) => e.preventDefault()}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* Step 1: Personal Information */}
            {activeStep === 0 && (
              <StyledFormSection>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                  Personal Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="name">Full Name *</FormLabel>
                      <TextField
                        autoComplete="name"
                        name="name"
                        required
                        fullWidth
                        id="name"
                        placeholder="Ayush Kumar"
                        error={formErrors.name.error}
                        helperText={formErrors.name.message}
                        color={formErrors.name.error ? "error" : "primary"}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="email">Email Address *</FormLabel>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        placeholder="ayushkumar_cs24a02_052@dtu.ac.in"
                        name="email"
                        autoComplete="email"
                        variant="outlined"
                        error={formErrors.email.error}
                        helperText={formErrors.email.message}
                        color={formErrors.email.error ? "error" : "primary"}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="mobileNumber">Mobile Number *</FormLabel>
                      <TextField
                        required
                        fullWidth
                        id="mobileNumber"
                        name="mobileNumber"
                        placeholder="8307266041"
                        type="tel"
                        inputProps={{ pattern: "[0-9]{10}" }}
                        error={formErrors.mobileNumber.error}
                        helperText={formErrors.mobileNumber.message}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="dateOfBirth">Date of Birth *</FormLabel>
                      <TextField
                        required
                        fullWidth
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        variant="outlined"
                        error={formErrors.dateOfBirth.error}
                        helperText={formErrors.dateOfBirth.message}
                        InputLabelProps={{ shrink: true }}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="address">Address *</FormLabel>
                      <TextField
                        required
                        fullWidth
                        id="address"
                        name="address"
                        placeholder="123, Example Street, City, State, Pincode"
                        variant="outlined"
                        multiline
                        rows={2}
                        error={formErrors.address.error}
                        helperText={formErrors.address.message}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </StyledFormSection>
            )}
            
            {/* Step 2: Academic Details */}
            {activeStep === 1 && (
              <StyledFormSection>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                  Academic Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="userType">User Type *</FormLabel>
                      <TextField
                        select
                        required
                        fullWidth
                        id="userType"
                        name="userType"
                        defaultValue="student"
                        SelectProps={{ native: true }}
                      >
                        <option value="faculty">Faculty</option>
                        <option value="student">Student (UG/PG)</option>
                        <option value="researchScholar">Research Scholar</option>
                        <option value="committeeMember">Committee Member</option>
                        <option value="competentauthority">Competent Authority</option>
                      </TextField>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="employeeId">Employee ID/Student Roll Number *</FormLabel>
                      <TextField
                        required
                        fullWidth
                        id="employeeId"
                        name="employeeId"
                        placeholder="2024/A02/052"
                        error={formErrors.employeeId.error}
                        helperText={formErrors.employeeId.message}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="department">Department *</FormLabel>
                      <TextField
                        select
                        required
                        fullWidth
                        id="department"
                        name="department"
                        defaultValue="computerScience"
                        SelectProps={{ native: true }}
                      >
                        <option value="computerScience">Computer Science & Engineering</option>
                        <option value="mechanicalEngineering">Mechanical Engineering</option>
                        <option value="electricalEngineering">Electrical Engineering</option>
                        <option value="electronicsCommunication">Electronics & Communication</option>
                        <option value="civilEngineering">Civil Engineering</option>
                        <option value="biotechnology">Biotechnology</option>
                        <option value="appliedMathematics">Applied Mathematics</option>
                        <option value="appliedPhysics">Applied Physics</option>
                        <option value="appliedChemistry">Applied Chemistry</option>
                        <option value="management">Management Studies</option>
                      </TextField>
                    </FormControl>
                  </Grid>
                </Grid>
              </StyledFormSection>
            )}
            
            {/* Step 3: Banking Information */}
            {activeStep === 2 && (
              <StyledFormSection>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                  Banking Information
                </Typography>
                
                <Alert severity="info" sx={{ mb: 2 }}>
                  Your banking information is required for research grants and project funding purposes.
                </Alert>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="accountHolderName">Account Holder Name *</FormLabel>
                      <TextField
                        required
                        fullWidth
                        id="accountHolderName"
                        name="accountHolderName"
                        placeholder="Full Name as per Bank Records"
                        variant="outlined"
                        error={formErrors.accountHolderName.error}
                        helperText={formErrors.accountHolderName.message}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="bankAccount">Account Number *</FormLabel>
                      <TextField
                        required
                        fullWidth
                        id="bankAccount"
                        name="bankAccount"
                        placeholder="1234567890"
                        variant="outlined"
                        error={formErrors.bankAccount.error}
                        helperText={formErrors.bankAccount.message}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="bankName">Bank Name *</FormLabel>
                      <TextField
                        required
                        fullWidth
                        id="bankName"
                        name="bankName"
                        placeholder="State Bank of India"
                        variant="outlined"
                        error={formErrors.bankName.error}
                        helperText={formErrors.bankName.message}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="branchName">Branch Name *</FormLabel>
                      <TextField
                        required
                        fullWidth
                        id="branchName"
                        name="branchName"
                        placeholder="Connaught Place"
                        variant="outlined"
                        error={formErrors.branchName.error}
                        helperText={formErrors.branchName.message}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="ifsc">IFSC Code *</FormLabel>
                      <TextField
                        required
                        fullWidth
                        id="ifsc"
                        name="ifsc"
                        placeholder="SBIN0000XXX"
                        variant="outlined"
                        error={formErrors.ifsc.error}
                        helperText={formErrors.ifsc.message}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </StyledFormSection>
            )}
            
            {/* Step 4: Password */}
            {activeStep === 3 && (
              <StyledFormSection>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                  Set Password
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="password">Password *</FormLabel>
                      <TextField
                        required
                        fullWidth
                        name="password"
                        placeholder="••••••••"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        variant="outlined"
                        error={formErrors.password.error}
                        helperText={formErrors.password.message}
                        color={formErrors.password.error ? "error" : "primary"}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor="confirmPassword">Confirm Password *</FormLabel>
                      <TextField
                        required
                        fullWidth
                        name="confirmPassword"
                        placeholder="••••••••"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        variant="outlined"
                        error={formErrors.confirmPassword.error}
                        helperText={formErrors.confirmPassword.message}
                        color={formErrors.confirmPassword.error ? "error" : "primary"}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Checkbox id="terms" name="terms" value="agree" color="primary" />}
                      label={
                        <Typography variant="body2">
                          I agree to the{" "}
                          <Link href="#" variant="body2">
                            Terms and Conditions
                          </Link>{" "}
                          of the DTU Research Portal.
                        </Typography>
                      }
                      sx={{ 
                        color: formErrors.terms.error ? "error.main" : "inherit",
                        marginTop: 1 
                      }}
                    />
                    {formErrors.terms.error && (
                      <Typography variant="caption" color="error">
                        {formErrors.terms.message}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </StyledFormSection>
            )}
            
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0 || formSubmitted}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={formSubmitted}
                  sx={{ ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? "Create Account" : "Next"}
                </Button>
              </Box>
            </Box>
            
            {formSubmitted && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Creating your account... Please wait.
              </Alert>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Link href="/signin" variant="body2" sx={{ fontWeight: 500 }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}