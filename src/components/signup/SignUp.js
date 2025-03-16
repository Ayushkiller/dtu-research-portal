import React, { useState } from "react";
import axios from "axios";
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
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import API from "../../api/axios";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  maxWidth: "450px",
  maxHeight: "80vh",
  overflowY: "auto",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
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

export default function SignUp(props) {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState("");
  const [termsError, setTermsError] = useState(false);
  const [dateOfBirthError, setDateOfBirthError] = useState(false);
  const [dateOfBirthErrorMessage, setDateOfBirthErrorMessage] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [addressErrorMessage, setAddressErrorMessage] = useState("");
  const [bankAccountError, setBankAccountError] = useState(false);
  const [bankAccountErrorMessage, setBankAccountErrorMessage] = useState("");
  const [bankNameError, setBankNameError] = useState(false);
  const [bankNameErrorMessage, setBankNameErrorMessage] = useState("");
  const [branchNameError, setBranchNameError] = useState(false);
  const [branchNameErrorMessage, setBranchNameErrorMessage] = useState("");
  const [ifscError, setIfscError] = useState(false);
  const [ifscErrorMessage, setIfscErrorMessage] = useState("");
  const [accountHolderError, setAccountHolderError] = useState(false);
  const [accountHolderErrorMessage, setAccountHolderErrorMessage] = useState("");

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const name = document.getElementById("name");
    const terms = document.getElementById("terms");
    const dateOfBirth = document.getElementById("dateOfBirth");
    const address = document.getElementById("address");
    const bankAccount = document.getElementById("bankAccount");
    const bankName = document.getElementById("bankName");
    const branchName = document.getElementById("branchName");
    const ifsc = document.getElementById("ifsc");
    const accountHolderName = document.getElementById("accountHolderName");

    let isValid = true;

    if (!email.value || !/\S+@dtu\.ac\.in$/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid DTU email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (
      !password.value ||
      password.value.length < 8 ||
      !/[A-Za-z]/.test(password.value) ||
      !/\d/.test(password.value) ||
      !/[!@#$%^&*]/.test(password.value)
    ) {
      setPasswordError(true);
      setPasswordErrorMessage(
        "Password must be at least 8 characters long and include letters, numbers, and symbols."
      );
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (password.value !== confirmPassword.value) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage("");
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    if (!terms.checked) {
      setTermsError(true);
      isValid = false;
    } else {
      setTermsError(false);
    }

    if (!dateOfBirth.value) {
      setDateOfBirthError(true);
      setDateOfBirthErrorMessage("Date of birth is required.");
      isValid = false;
    } else {
      setDateOfBirthError(false);
      setDateOfBirthErrorMessage("");
    }

    if (!address.value) {
      setAddressError(true);
      setAddressErrorMessage("Address is required.");
      isValid = false;
    } else {
      setAddressError(false);
      setAddressErrorMessage("");
    }

    if (!bankAccount.value) {
      setBankAccountError(true);
      setBankAccountErrorMessage("Bank account info is required.");
      isValid = false;
    } else {
      setBankAccountError(false);
      setBankAccountErrorMessage("");
    }

    if (!bankName.value) {
      setBankNameError(true);
      setBankNameErrorMessage("Bank name is required.");
      isValid = false;
    } else {
      setBankNameError(false);
      setBankNameErrorMessage("");
    }

    if (!branchName.value) {
      setBranchNameError(true);
      setBranchNameErrorMessage("Branch name is required.");
      isValid = false;
    } else {
      setBranchNameError(false);
      setBranchNameErrorMessage("");
    }

    if (!ifsc.value) {
      setIfscError(true);
      setIfscErrorMessage("IFSC code is required.");
      isValid = false;
    } else {
      setIfscError(false);
      setIfscErrorMessage("");
    }

    if (!accountHolderName.value) {
      setAccountHolderError(true);
      setAccountHolderErrorMessage("Account holder name is required.");
      isValid = false;
    } else {
      setAccountHolderError(false);
      setAccountHolderErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }

    const data = new FormData(event.currentTarget);
    const userData = {
      name: data.get("name"),
      email: data.get("email"),
      userType: data.get("userType"),
      employeeId: data.get("employeeId"),
      department: data.get("department"),
      mobileNumber: data.get("mobileNumber"),
      password: data.get("password"),
      dateOfBirth: data.get("dateOfBirth"),
      address: data.get("address"),
      bankAccount: data.get("bankAccount"),
      bankName: data.get("bankName"),
      branchName: data.get("branchName"),
      ifsc: data.get("ifsc"),
      accountHolderName: data.get("accountHolderName"),
    };

    try {
      // const response = await axios.post(
      //   "https://dtubackend.something.vyvsai.com/auth/register",
      //   userData
      // );
      const response = await API.post("/auth/register", userData);
      console.log(response.data);
      alert("User registered successfully!");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Failed to register user.");
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: 50, width: 50, margin: "0 auto" }}
          />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Ayush Kumar"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="ayushkumar_cs24a02_052@dtu.ac.in"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="userType">User Type</FormLabel>
              <TextField
                select
                required
                fullWidth
                id="userType"
                name="userType"
                SelectProps={{ native: true }}
              >
                <option value="faculty">Faculty</option>
                <option value="student">
                  Student (Undergraduate/Postgraduate)
                </option>
                <option value="researchScholar">Research Scholar</option>
                <option value="committeeMember">Commitee Member</option>
                <option value="competentauthority">Competent Authority</option>
              </TextField>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="employeeId">
                Employee ID/Student Roll Number
              </FormLabel>
              <TextField
                required
                fullWidth
                id="employeeId"
                name="employeeId"
                placeholder="2024/A02/052"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="department">Department</FormLabel>
              <TextField
                select
                required
                fullWidth
                id="department"
                name="department"
                SelectProps={{ native: true }}
              >
                <option value="computerScience">Computer Science</option>
                <option value="mechanicalEngineering">
                  Mechanical Engineering
                </option>
                {/* Add more departments as needed */}
              </TextField>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="mobileNumber">Mobile Number</FormLabel>
              <TextField
                required
                fullWidth
                id="mobileNumber"
                name="mobileNumber"
                placeholder="8307266041"
                type="tel"
                inputProps={{ pattern: "[0-9]{10}" }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
              <TextField
                required
                fullWidth
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                variant="outlined"
                error={dateOfBirthError}
                helperText={dateOfBirthErrorMessage}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="address">Address</FormLabel>
              <TextField
                required
                fullWidth
                id="address"
                name="address"
                placeholder="123, Example Street"
                variant="outlined"
                error={addressError}
                helperText={addressErrorMessage}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="bankAccount">Bank Account Info</FormLabel>
              <TextField
                required
                fullWidth
                id="bankAccount"
                name="bankAccount"
                placeholder="1234567890"
                variant="outlined"
                error={bankAccountError}
                helperText={bankAccountErrorMessage}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="bankName">Bank Name</FormLabel>
              <TextField
                required
                fullWidth
                id="bankName"
                name="bankName"
                placeholder="State Bank of India"
                variant="outlined"
                error={bankNameError}
                helperText={bankNameErrorMessage}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="branchName">Branch Name</FormLabel>
              <TextField
                required
                fullWidth
                id="branchName"
                name="branchName"
                placeholder="Connaught Place"
                variant="outlined"
                error={branchNameError}
                helperText={branchNameErrorMessage}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="ifsc">IFSC Code</FormLabel>
              <TextField
                required
                fullWidth
                id="ifsc"
                name="ifsc"
                placeholder="SBIN000000"
                variant="outlined"
                error={ifscError}
                helperText={ifscErrorMessage}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="accountHolderName">Account Holder Name</FormLabel>
              <TextField
                required
                fullWidth
                id="accountHolderName"
                name="accountHolderName"
                placeholder="Full Name"
                variant="outlined"
                error={accountHolderError}
                helperText={accountHolderErrorMessage}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError || false} // Ensure error is boolean
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                placeholder="••••••"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                variant="outlined"
                error={confirmPasswordError || false} // Ensure error is boolean
                helperText={confirmPasswordErrorMessage}
                color={confirmPasswordError ? "error" : "primary"}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox id="terms" value="agree" color="primary" />}
              label="I agree to the Terms and Conditions of the DTU Research Portal."
              error={termsError}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign up
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Link href="/signin" variant="body2" sx={{ alignSelf: "center" }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
