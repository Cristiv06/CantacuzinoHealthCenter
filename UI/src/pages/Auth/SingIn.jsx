import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { useValidation } from "../../validations/useValidation";
import VALIDATIONS from "../../validations";
import Validator from "../../validations/Validator";
import useAuthService from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import { useAccount } from "../../contexts/AccountContext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
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
  height: "100%",
  backgroundImage:
    "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
  backgroundRepeat: "no-repeat",
  ...theme.applyStyles("dark", {
    backgroundImage:
      "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
  }),
}));

export default function SignIn({ setIsLogin }) {
  const { login } = useAuthService();
  const { setIsAuth } = useAccount();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = React.useState("");

  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleSignUpClick = () => {
    setIsLogin((prevState) => !prevState);
  };

  const {
    values: loginDetails,
    errors,
    onChangeInput,
    handleCheckFormErrors,
    applyErrorsFromApi,
  } = useValidation(
    new Validator()
      .forProperty("email")
      .check(VALIDATIONS.isRequired, "Email is required")
      .check(VALIDATIONS.isEmail, "Please enter a valid email")
      .forProperty("password")
      .check(VALIDATIONS.isRequired, "Password is required")
      .check(
        VALIDATIONS.minLength(3),
        "Password must be at least 3 characters long"
      )
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleCheckFormErrors()) {
      try {
        await login(loginDetails);
        setIsAuth(true);
        navigate("/");
      } catch (err) {
        applyErrorsFromApi(err.message.errors);
        setErrorMessage(err.message.errors);
        setOpen(true);
      }
    }
  };

  return (
    <SignInContainer direction="column" justifyContent="center">
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Sign in
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel error={!!errors.email} htmlFor="email">
              Email
            </FormLabel>
            <TextField
              error={!!errors.email}
              helperText={errors.email ? "Please enter a valid email" : ""}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              required
              fullWidth
              variant="outlined"
              color={errors.email ? "error" : "primary"}
              onChange={onChangeInput}
              value={loginDetails.email}
            />
          </FormControl>
          <FormControl>
            <FormLabel error={!!errors.password} htmlFor="password">
              Password
            </FormLabel>
            <TextField
              error={!!errors.password}
              helperText={errors.password ? "Please enter your password" : ""}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              color={errors.password ? "error" : "primary"}
              value={loginDetails.password}
              onChange={onChangeInput}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleSubmit}
          >
            Sign in
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <span>
              <Link
                component="button"
                variant="body2"
                sx={{ alignSelf: "center" }}
                onClick={handleSignUpClick}
              >
                Sign up
              </Link>
            </span>
          </Typography>
        </Box>
      </Card>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </SignInContainer>
  );
}
