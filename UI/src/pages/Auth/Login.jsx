// import React from "react";
// import {
//   Button,
//   FormControl,
//   Input,
//   InputLabel,
//   Stack,
//   Typography,
//   Alert,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useAccount } from "../../contexts/AccountContext";
// import useAuthService from "../../services/UserService";
// import { useValidation } from "../../validations/useValidation";
// import VALIDATIONS from "../../validations";
// import Validator from "../../validations/Validator";

// const LoginPage = () => {
//   const { login } = useAuthService();
//   const { setIsAuth } = useAccount();
//   const navigate = useNavigate();

//   const {
//     values: loginDetails,
//     errors,
//     onChangeInput,
//     handleCheckFormErrors,
//     applyErrorsFromApi,
//   } = useValidation(
//     new Validator()
//       .forProperty("email")
//       .check(VALIDATIONS.isRequired, "Error is required")
//       .forProperty("password")
//       .check(VALIDATIONS.isRequired, "Error is required")
//       .check(VALIDATIONS.minLength(3), "Min length 3")
//   );

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!handleCheckFormErrors()) {
//       try {
//         await login(loginDetails);
//         setIsAuth(true);
//         navigate("/home");
//       } catch (err) {
//         applyErrorsFromApi(err.message.errors);
//       }
//     }
//   };

//   return (
//     <div className="login-container">
//       <form onSubmit={handleSubmit} className="login-form">
//         <Typography variant="h2" className="login-title">
//           Login
//         </Typography>
//         <Stack gap={3} className="login-stack">
//           <FormControl className="login-form-control">
//             <InputLabel className="login-input-label">Email</InputLabel>
//             <Input
//               name="email"
//               value={loginDetails.email}
//               onChange={onChangeInput}
//               error={errors.email}
//               className="login-input"
//             />
//           </FormControl>
//           <FormControl className="login-form-control">
//             <InputLabel className="login-input-label">Password</InputLabel>
//             <Input
//               type="password"
//               name="password"
//               value={loginDetails.password}
//               onChange={onChangeInput}
//               error={errors.password}
//               className="login-input"
//             />
//             {errors.password && (
//               <Alert severity="error" className="login-alert">
//                 {errors.password}
//               </Alert>
//             )}
//           </FormControl>
//           <Button variant="contained" type="submit" className="login-button">
//             Login
//           </Button>
//         </Stack>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;
