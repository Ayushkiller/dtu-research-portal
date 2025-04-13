import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
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
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ForgotPassword from "./ForgotPassword";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeSelect from "../shared-theme/ColorModeSelect";
import API from "../../api/axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(5),
  gap: theme.spacing(3),
  margin: "auto",
  borderRadius: theme.shape.borderRadius * 2,
  maxHeight: "90vh",
  overflowY: "auto",
  overflowX: "hidden",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

export default function SignIn(props) {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    rememberMe: false,
    showPassword: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  // Check for existing token on mount
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        redirectBasedOnUserType(decodedToken.userType);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const redirectBasedOnUserType = (userType) => {
    if (userType === "competentAuthority") {
      navigate("/dean-dashboard");
    } else if (userType === "committeeMember") {
      navigate("/committee-dashboard");
    } else if (["student", "faculty", "researchScholar"].includes(userType)) {
      navigate("/dashboard");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormState({
      ...formState,
      [name]: type === "checkbox" ? checked : value,
    });

    // Validate on change
    if (name === "email") {
      validateEmail(value);
    } else if (name === "password") {
      validatePassword(value);
    }
  };

  const validateEmail = (email) => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
      return true;
    }
  };

  const validatePassword = (password) => {
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return false;
    } else if (password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters long",
      }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
      return true;
    }
  };

  const togglePasswordVisibility = () => {
    setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isEmailValid = validateEmail(formState.email);
    const isPasswordValid = validatePassword(formState.password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email: formState.email,
        password: formState.password,
      });

      const { token } = response.data;

      // Set cookie expiration based on "remember me"
      const expirationTime = formState.rememberMe ? 7 : 1 / 24; // 7 days or 1 hour
      Cookies.set("token", token, { expires: expirationTime });

      const decodedToken = jwtDecode(token);

      setNotification({
        open: true,
        message: "Login successful!",
        severity: "success",
      });

      // Short delay before redirect for notification to be seen
      setTimeout(() => {
        redirectBasedOnUserType(decodedToken.userType);
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setNotification({
        open: true,
        message:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect
          sx={{ position: "fixed", top: "1rem", right: "1rem" }}
        />

        <Card variant="outlined">
          <LogoContainer>
            <img src="/logo.png" alt="Logo" style={{ height: 64, width: 64 }} />
          </LogoContainer>

          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
              fontWeight: 600,
              textAlign: "center",
              mb: 2,
            }}
          >
            Sign in
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 3,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email" sx={{ mb: 1 }}>
                Email
              </FormLabel>
              <TextField
                id="email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleInputChange}
                onBlur={() => validateEmail(formState.email)}
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password" sx={{ mb: 1 }}>
                Password
              </FormLabel>
              <TextField
                id="password"
                name="password"
                type={formState.showPassword ? "text" : "password"}
                value={formState.password}
                onChange={handleInputChange}
                onBlur={() => validatePassword(formState.password)}
                placeholder="••••••"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {formState.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={formState.rememberMe}
                  onChange={handleInputChange}
                  color="primary"
                />
              }
              label="Remember me"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                mt: 1,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign in"
              )}
            </Button>

            <Stack direction="row" justifyContent="center" spacing={1}>
              <Typography>Don't have an account?</Typography>
              <Link href="/signup" variant="body2" sx={{ fontWeight: 600 }}>
                Sign up
              </Link>
            </Stack>

            <Link
              component="button"
              type="button"
              onClick={() => setForgotPasswordOpen(true)}
              variant="body2"
              sx={{ alignSelf: "center", mt: 1 }}
            >
              Forgot your password?
            </Link>
          </Box>
        </Card>

        <ForgotPassword
          open={forgotPasswordOpen}
          handleClose={() => setForgotPasswordOpen(false)}
        />

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={closeNotification}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={closeNotification}
            severity={notification.severity}
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </SignInContainer>
    </AppTheme>
  );
}
