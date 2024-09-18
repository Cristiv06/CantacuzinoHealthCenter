// import {
//   Alert,
//   Button,
//   Checkbox,
//   FormControl,
//   MenuItem,
//   Select,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import useAuthService from "../../services/UserService";
// import { useValidation } from "../../validations/useValidation";
// import VALIDATIONS from "../../validations";
// import Validator from "../../validations/Validator";

// const Register = () => {
//   const navigate = useNavigate();

//   const formValidator = new Validator()
//     .forProperty("email")
//     .check(VALIDATIONS.isRequired, "Email is required")
//     .check(VALIDATIONS.isEmail, "Please enter a valid email address")
//     .forProperty("password")
//     .check(VALIDATIONS.isRequired, "Password is required")
//     .check(
//       VALIDATIONS.minLength(4),
//       "Password must be at least 4 characters long"
//     )
//     .forProperty("firstName")
//     .check(VALIDATIONS.isRequired, "First Name is required")
//     .forProperty("lastName")
//     .check(VALIDATIONS.isRequired, "Last Name is required")
//     .forProperty("age")
//     .check(VALIDATIONS.isRequired, "Age is required")
//     .check(VALIDATIONS.isNumeric, "Age must be a valid number")
//     .forProperty("address")
//     .check(VALIDATIONS.isRequired, "Address is required")
//     .forProperty("healthIssues")
//     .check(VALIDATIONS.isRequired, "Please specify any health issues")
//     .applyCheckOnlyOnSubmit();

//   const {
//     values: formData,
//     errors: formErrors,
//     onChangeInput,
//     handleCheckFormErrors,
//     applyErrorsFromApi,
//   } = useValidation(formValidator);

//   const { register } = useAuthService();

//   const handleSubmit = async () => {
//     if (!handleCheckFormErrors()) {
//       try {
//         await register(formData).then(() => navigate("/login"));
//       } catch (err) {
//         applyErrorsFromApi(err.message.errors);
//       }
//     }
//   };

//   return (
//     <div>
//       <Typography variant="h2" color={"black"}>
//         Register
//       </Typography>
//       <Stack gap={3}>
//         <FormControl>
//           <TextField
//             error={formErrors["firstName"]}
//             label="First Name"
//             variant="standard"
//             name="firstName"
//             value={formData.firstName}
//             onChange={onChangeInput}
//           />
//           {formErrors["firstName"] && (
//             <Alert severity="error">{formErrors["firstName"]}</Alert>
//           )}
//         </FormControl>
//         <FormControl>
//           <TextField
//             error={formErrors["lastName"]}
//             label="Last Name"
//             variant="standard"
//             name="lastName"
//             value={formData.lastName}
//             onChange={onChangeInput}
//           />
//           {formErrors["lastName"] && (
//             <Alert severity="error">{formErrors["lastName"]}</Alert>
//           )}
//         </FormControl>
//         <FormControl>
//           <TextField
//             error={formErrors["email"]}
//             label="Email"
//             variant="standard"
//             name="email"
//             value={formData.email}
//             onChange={onChangeInput}
//           />
//           {formErrors["email"] && (
//             <Alert severity="error">{formErrors["email"]}</Alert>
//           )}
//         </FormControl>
//         <FormControl>
//           <TextField
//             error={formErrors["password"]}
//             label="Password"
//             variant="standard"
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={onChangeInput}
//           />
//           {formErrors["password"] && (
//             <Alert severity="error">{formErrors["password"]}</Alert>
//           )}
//         </FormControl>
//         <FormControl>
//           <TextField
//             error={formErrors["age"]}
//             label="Age"
//             variant="standard"
//             name="age"
//             value={formData.age}
//             onChange={onChangeInput}
//           />
//           {formErrors["age"] && (
//             <Alert severity="error">{formErrors["age"]}</Alert>
//           )}
//         </FormControl>
//         <FormControl>
//           <TextField
//             error={formErrors["address"]}
//             label="Address"
//             variant="standard"
//             name="address"
//             value={formData.address}
//             onChange={onChangeInput}
//           />
//           {formErrors["email"] && (
//             <Alert severity="error">{formErrors["email"]}</Alert>
//           )}
//         </FormControl>
//         <FormControl>
//           <TextField
//             error={formErrors["healthIssues"]}
//             label="Health Issues"
//             variant="standard"
//             name="healthIssues"
//             value={formData.healthIssues}
//             onChange={onChangeInput}
//           />
//           {formErrors["healthIssues"] && (
//             <Alert severity="error">{formErrors["healthIssues"]}</Alert>
//           )}
//         </FormControl>
//         <Button variant="outlined" onClick={handleSubmit}>
//           Register
//         </Button>
//       </Stack>
//     </div>
//   );
// };

// export default Register;
