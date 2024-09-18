import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import useAuthService from "../../services/UserService";
import { Select, MenuItem, Grid, FormHelperText } from "@mui/material";
import backgroundImage from "../../components/infrastructure/homePageBackground.jpg";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)",
  [theme.breakpoints.up("sm")]: {
    width: "700px",
  },
  backgroundColor: "#ffffff",
  borderRadius: theme.shape.borderRadius,
}));

const CreateDoctorProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    degreeId: "",
    specializationsList: [],
    programsList: [],
    unavailableList: [],
  });
  const [specialization, setSpecialization] = useState({
    id: "",
    customPrice: "",
  });
  const [program, setProgram] = useState({
    id: "",
    startingHour: "",
    endingHour: "",
    dayOfWeek: "",
  });
  const [unavailablePeriod, setUnavailablePeriod] = useState({
    id: "",
    startingDay: "",
    endingDay: "",
    reasonId: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [degrees, setDegrees] = useState([]);
  const [availableSpecializations, setAvailableSpecializations] = useState([]);
  const navigate = useNavigate();
  const { registerDoctor, fetchDegrees, fetchSpecializations } =
    useAuthService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [degreesData, specializationsData] = await Promise.all([
          fetchDegrees(),
          fetchSpecializations(),
        ]);
        setDegrees(degreesData);
        setAvailableSpecializations(specializationsData);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchData();
  }, [fetchDegrees, fetchSpecializations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSpecializationChange = (e) => {
    const { name, value } = e.target;
    setSpecialization({
      ...specialization,
      [name]: value,
    });
  };

  const handleProgramChange = (e) => {
    const { name, value } = e.target;
    setProgram({
      ...program,
      [name]: value,
    });
  };

  const handleUnavailablePeriodChange = (e) => {
    const { name, value } = e.target;
    setUnavailablePeriod({
      ...unavailablePeriod,
      [name]: value,
    });
  };

  const handleAddSpecialization = () => {
    setFormData({
      ...formData,
      specializationsList: [
        ...formData.specializationsList,
        { ...specialization, id: parseInt(specialization.id, 10) }, // Ensure specialization ID is a number
      ],
    });
    setSpecialization({ id: "", customPrice: "" }); // Clear input fields
  };

  const handleAddProgram = () => {
    setFormData({
      ...formData,
      programsList: [
        ...formData.programsList,
        {
          ...program,
          id: program.id,
          dayOfWeek: parseInt(program.dayOfWeek, 10),
        },
      ],
    });
    setProgram({ id: "", startingHour: "", endingHour: "", dayOfWeek: "" }); // Clear input fields
  };

  const handleAddUnavailablePeriod = () => {
    setFormData({
      ...formData,
      unavailableList: [
        ...formData.unavailableList,
        { ...unavailablePeriod, id: unavailablePeriod.id },
      ],
    });
    setUnavailablePeriod({
      id: "",
      startingDay: "",
      endingDay: "",
      reasonId: "",
    }); // Clear input fields
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName) errors.firstName = "First Name is required";
    if (!formData.lastName) errors.lastName = "Last Name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.degreeId) errors.degreeId = "Degree is required";
    if (formData.specializationsList.length === 0)
      errors.specializationsList = "At least one specialization is required";
    if (formData.programsList.length === 0)
      errors.programsList = "At least one program is required";
    if (formData.unavailableList.length === 0)
      errors.unavailableList = "At least one unavailable period is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await registerDoctor(formData);
        navigate("/dashboard"); // Redirect to another page after successful registration
      } catch (err) {
        console.error(err);
        setFormErrors(err.response?.data || {}); // Handle form errors from API
      }
    }
  };

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 2,
      }}
    >
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ marginBottom: 3, color: "#00796b" }}
        >
          Create Doctor Profile
        </Typography>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          onSubmit={handleSubmit}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <TextField
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                <TextField
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  id="email"
                  name="email"
                  required
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  id="password"
                  name="password"
                  required
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor="degreeId">Degree</FormLabel>
                <Select
                  id="degreeId"
                  name="degreeId"
                  required
                  value={formData.degreeId}
                  onChange={handleChange}
                  displayEmpty
                  error={!!formErrors.degreeId}
                >
                  <MenuItem value="" disabled>
                    Select Degree
                  </MenuItem>
                  {degrees.map((degree) => (
                    <MenuItem key={degree.id} value={degree.id}>
                      {degree.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.degreeId && (
                  <FormHelperText error>{formErrors.degreeId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Typography variant="h6">Add Specialization</Typography>
                <FormLabel htmlFor="specializationId">Specialization</FormLabel>
                <Select
                  id="specializationId"
                  name="id"
                  value={specialization.id}
                  onChange={handleSpecializationChange}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Specialization
                  </MenuItem>
                  {availableSpecializations.map((spec) => (
                    <MenuItem key={spec.id} value={spec.id}>
                      {spec.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormLabel htmlFor="customPrice">Custom Price</FormLabel>
                <TextField
                  id="customPrice"
                  name="customPrice"
                  type="number"
                  value={specialization.customPrice}
                  onChange={handleSpecializationChange}
                  placeholder="200"
                />
                <Button
                  onClick={handleAddSpecialization}
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 1 }}
                >
                  Add Specialization
                </Button>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Typography variant="h6">Add Program</Typography>
                <FormLabel htmlFor="programId">Program ID</FormLabel>
                <TextField
                  id="programId"
                  name="id"
                  value={program.id}
                  onChange={handleProgramChange}
                  placeholder="e.g., a3b67cde-4444-5555-8888-123456789abc"
                />
                <FormLabel htmlFor="startingHour">Starting Hour</FormLabel>
                <TextField
                  id="startingHour"
                  name="startingHour"
                  value={program.startingHour}
                  onChange={handleProgramChange}
                  placeholder="09:00:00"
                />
                <FormLabel htmlFor="endingHour">Ending Hour</FormLabel>
                <TextField
                  id="endingHour"
                  name="endingHour"
                  value={program.endingHour}
                  onChange={handleProgramChange}
                  placeholder="17:00:00"
                />
                <FormLabel htmlFor="dayOfWeek">Day of Week</FormLabel>
                <TextField
                  id="dayOfWeek"
                  name="dayOfWeek"
                  type="number"
                  value={program.dayOfWeek}
                  onChange={handleProgramChange}
                  placeholder="1"
                />
                <Button
                  onClick={handleAddProgram}
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 1 }}
                >
                  Add Program
                </Button>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Typography variant="h6">Add Unavailable Period</Typography>
                <FormLabel htmlFor="unavailablePeriodId">
                  Unavailable Period ID
                </FormLabel>
                <TextField
                  id="unavailablePeriodId"
                  name="id"
                  value={unavailablePeriod.id}
                  onChange={handleUnavailablePeriodChange}
                  placeholder="e.g., a3b67cde-9999-aaaa-bbbb-123456789abc"
                />
                <FormLabel htmlFor="startingDay">Starting Day</FormLabel>
                <TextField
                  id="startingDay"
                  name="startingDay"
                  type="date"
                  value={unavailablePeriod.startingDay}
                  onChange={handleUnavailablePeriodChange}
                />
                <FormLabel htmlFor="endingDay">Ending Day</FormLabel>
                <TextField
                  id="endingDay"
                  name="endingDay"
                  type="date"
                  value={unavailablePeriod.endingDay}
                  onChange={handleUnavailablePeriodChange}
                />
                <FormLabel htmlFor="reasonId">Reason ID</FormLabel>
                <TextField
                  id="reasonId"
                  name="reasonId"
                  value={unavailablePeriod.reasonId}
                  onChange={handleUnavailablePeriodChange}
                  placeholder="2"
                />
                <Button
                  onClick={handleAddUnavailablePeriod}
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 1 }}
                >
                  Add Unavailable Period
                </Button>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Create Profile
          </Button>
        </Box>
      </Card>
    </Stack>
  );
};

export default CreateDoctorProfile;
