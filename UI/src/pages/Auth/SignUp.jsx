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

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
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
  height: "100%",
  backgroundImage:
    "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
  backgroundRepeat: "no-repeat",
  ...theme.applyStyles("dark", {
    backgroundImage:
      "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
  }),
}));

export default function SignUp({ setIsLogin }) {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    setIsLogin((prevState) => !prevState);
  };

  const formValidator = new Validator()
    .forProperty("email")
    .check(VALIDATIONS.isRequired, "Missing")
    .check(VALIDATIONS.isEmail, "Not a valid email")
    .forProperty("password")
    .check(VALIDATIONS.isRequired, "Message de 4 carac minim")
    .forProperty("firstName")
    .check(VALIDATIONS.isRequired, "First Name is required")
    .forProperty("lastName")
    .check(VALIDATIONS.isRequired, "Last Name is required")
    .forProperty("age")
    .check(VALIDATIONS.isRequired, "Age is required")
    .check(VALIDATIONS.isNumeric, "Age must be a number")
    .forProperty("address")
    .check(VALIDATIONS.isRequired, "Address is required")
    .forProperty("healthIssues")
    .check(VALIDATIONS.isRequired, "Health Issues is required")
    .applyCheckOnlyOnSubmit();

  const {
    values: formData,
    errors: formErrors,
    onChangeInput,
    handleCheckFormErrors,
    applyErrorsFromApi,
  } = useValidation(formValidator);

  const { register } = useAuthService();

  const handleSubmit = async () => {
    if (!handleCheckFormErrors()) {
      try {
        await register(formData).then(() => navigate("/login"));
      } catch (err) {
        applyErrorsFromApi(err.message.errors);
      }
    }
  };
  return (
    <SignUpContainer direction="column" justifyContent="space-between">
      <Stack
        sx={{
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Card variant="outlined">
          {/* <SitemarkIcon /> */}
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="firstName">First name</FormLabel>
              <TextField
                autoComplete="firstName"
                name="firstName"
                required
                fullWidth
                id="firstName"
                placeholder="Jon"
                error={formErrors.firstName}
                helperText={formErrors.firstName}
                value={formData.firstName}
                onChange={onChangeInput}
                color={formErrors.firstName ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="lastName">Last name</FormLabel>
              <TextField
                autoComplete="lastName"
                name="lastName"
                required
                fullWidth
                id="lastName"
                placeholder="Snow"
                error={formErrors.lastName}
                helperText={formErrors.lastName}
                value={formData.lastName}
                onChange={onChangeInput}
                color={formErrors.lastName ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={formErrors.email}
                helperText={formErrors.email}
                value={formData.email}
                onChange={onChangeInput}
                color={formErrors.email ? "error" : "primary"}
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
                error={formErrors.password}
                helperText={formErrors.password}
                value={formData.password}
                onChange={onChangeInput}
                color={formErrors.password ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="age">Age</FormLabel>
              <TextField
                autoComplete="age"
                name="age"
                required
                fullWidth
                id="age"
                placeholder="18"
                error={formErrors.age}
                helperText={formErrors.age}
                value={formData.age}
                onChange={onChangeInput}
                color={formErrors.age ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="address">Address</FormLabel>
              <TextField
                autoComplete="address"
                name="address"
                required
                fullWidth
                id="address"
                placeholder="street..."
                error={formErrors.address}
                helperText={formErrors.address}
                value={formData.address}
                onChange={onChangeInput}
                color={formErrors.address ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="healthIssues">Health Issues</FormLabel>
              <TextField
                autoComplete="healthIssues"
                name="healthIssues"
                required
                fullWidth
                id="healthIssues"
                placeholder="cardiovascular..."
                error={formErrors.healthIssues}
                helperText={formErrors.healthIssues}
                value={formData.healthIssues}
                onChange={onChangeInput}
                color={formErrors.healthIssues ? "error" : "primary"}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleSubmit}
            >
              Sign up
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <span>
                <Link
                  component="button"
                  variant="body2"
                  sx={{ alignSelf: "center" }}
                  onClick={handleSignInClick}
                >
                  Sign in
                </Link>
              </span>
            </Typography>
          </Box>
        </Card>
      </Stack>
    </SignUpContainer>
  );
}
