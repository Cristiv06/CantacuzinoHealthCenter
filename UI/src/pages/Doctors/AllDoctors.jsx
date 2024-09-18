import React, { useCallback, useEffect, useState } from "react";
import useDoctorService from "../../services/DoctorService";
import useAuthService from "../../services/UserService";
import { useLocation, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import "../../styles/index.css";
import formatDate from "../../utils/formatDate";
import { Grid, Stack } from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import userSession from "../../utils/userSession";
import BookingConfirmationModal from "./BookingConfirmationModal";

export function formatDateToISO8601(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const offsetMinutes = date.getTimezoneOffset();
  const offsetSign = offsetMinutes <= 0 ? "+" : "-";
  const absOffsetMinutes = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(absOffsetMinutes / 60)).padStart(
    2,
    "0"
  );
  const offsetMins = String(absOffsetMinutes % 60).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMins}`;
}

const AllDoctors = () => {
  const {
    getAllDoctors,
    getDegrees,
    getSpecializations,
    getUnavailable,
    getUnAvailableHours,
    createAppointment,
  } = useDoctorService();
  const { fetchDetails } = useAuthService();

  const [doctorList, setDoctorList] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [unavailable, setUnavailable] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [unavailableHours, setUnavailableHours] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [doctorSpecializations, setDoctorSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [appointmentInfo, setAppointmentInfo] = useState("");
  const [selectedHour, setSelectedHour] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [photos, setPhotos] = useState([]);
  const [snackbarPosition, setSnackbarPosition] = useState({
    vertical: "top",
    horizontal: "center",
  });
  const [startHour, setStartHour] = useState(0);
  const [endHour, setEndHour] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const degreeIdFilter = query.get("degreeId") || "";
  const specializationIdFilter = query.get("specializationId") || "";
  const sortBy = query.get("sortBy") || "Name";
  const sortDesc = query.get("sortDesc") === "true";

  const skip = 0;
  const take = 100;

  const updateURL = (newFilters) => {
    const newQuery = new URLSearchParams(newFilters).toString();
    navigate(`?${newQuery}, { replace: true }`);
  };

  const handleChangeDegree = (event) => {
    updateURL({
      degreeId: event.target.value,
      specializationId: specializationIdFilter,
      sortBy,
      sortDesc,
    });
  };

  const handleChangeSpecialization = (event) => {
    updateURL({
      specializationId: event.target.value,
      degreeId: degreeIdFilter,
      sortBy,
      sortDesc,
    });
  };

  const handleChangeSortBy = (event) => {
    updateURL({
      sortBy: event.target.value,
      degreeId: degreeIdFilter,
      specializationId: specializationIdFilter,
      sortDesc,
    });
  };

  const handleToggleSortOrder = () => {
    updateURL({
      sortDesc: !sortDesc,
      degreeId: degreeIdFilter,
      specializationId: specializationIdFilter,
      sortBy,
    });
  };

  const handleResetFilters = () => {
    updateURL({
      degreeId: "",
      specializationId: "",
      sortBy: "Name",
      sortDesc: false,
    });
  };

  const handleSnackbarOpen = (
    message,
    position = { vertical: "top", horizontal: "center" }
  ) => {
    setSnackbarMessage(message);
    setSnackbarPosition(position);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const onSelectHour = (hour) => {
    setSelectedHour(hour);
  };

  const fetchUnavailablePeriods = async (doctorId) => {
    if (doctorId) {
      try {
        const unavailablePeriods = await getUnavailable(doctorId);
        setUnavailable(unavailablePeriods);
      } catch (error) {
        console.error("Failed to fetch unavailable periods:", error);
      }
    }
  };

  const fetchUnavailableHours = async (doctorId, date) => {
    if (doctorId) {
      try {
        const { startHour, endHour, unavailablePerios } =
          await getUnAvailableHours(doctorId, date);
        setUnavailableHours(unavailablePerios);
        setStartHour(startHour);
        setEndHour(endHour);
      } catch (error) {
        console.error("Failed to fetch unavailable hours:", error);
      }
    }
  };

  const handleOpen = (doctor) => {
    setOpen(true);
    setSelectedDoctorId(doctor.id);
    setDoctorSpecializations(doctor.specializationsList || []);
    setSelectedSpecialization(doctor.specializationsList[0]?.id || "");
    fetchUnavailablePeriods(doctor.id);
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDetails = await fetchDetails();
      setPatientId(userDetails.id);
    };

    fetchUserData();
  }, [fetchDetails]);

  useEffect(() => {
    const fetchFiltersData = async () => {
      const fetchedDegrees = await getDegrees();
      const fetchedSpecializations = await getSpecializations();
      setDegrees(fetchedDegrees);
      setSpecializations(fetchedSpecializations);
    };

    fetchFiltersData();
  }, []);

  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      const fetchHours = async () => {
        try {
          await fetchUnavailableHours(selectedDoctorId, selectedDate);
        } catch (error) {
          console.error("Failed to fetch unavailable hours:", error);
        }
      };
      fetchHours();
    }
  }, [selectedDoctorId, selectedDate]);

  const shouldDisableDate = useCallback(
    (ev) => {
      let formattedDate = formatDateToISO8601(new Date(ev.toString()));
      return (
        dayjs(ev).isBefore(dayjs(), "day") ||
        unavailable.includes(formattedDate)
      );
    },
    [unavailable]
  );

  const getPicture = async (picId) => {
    let res = await axios({
      url: `${import.meta.env.VITE_API_URL}/storage/download/` + picId,
      method: "GET",
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${userSession.token()}`,
        ContentType: "application/json",
      },
    });
    const href = URL.createObjectURL(res.data);
    return href;
  };

  useEffect(() => {
    const getData = async () => {
      let doctors = await getAllDoctors(
        "",
        specializationIdFilter,
        degreeIdFilter,
        sortBy,
        sortDesc,
        skip,
        take
      );
      let updatedDoctors = [];
      const doctorPromises = doctors.map(async (doc) => {
        let pic =
          doc.photoId && doc.photoId !== "00000000-0000-0000-0000-000000000000"
            ? await getPicture(doc?.photoId)
            : "";

        return {
          ...doc,
          photoId: pic,
        };
      });

      for (const docPromise of doctorPromises) {
        const updatedDoctor = await docPromise;

        updatedDoctors.push(updatedDoctor);

        setDoctorList([...updatedDoctors]);
      }
    };
    getData();
  }, [degreeIdFilter, specializationIdFilter, sortBy, sortDesc]);

  const handleCreateAppointment = async () => {
    if (
      !selectedDoctorId ||
      !selectedDate ||
      !selectedHour ||
      !selectedSpecialization ||
      !appointmentInfo ||
      !patientId
    ) {
      alert("Please complete all fields.");
      return;
    }

    const formattedDate = formatDate(selectedDate);
    const appointmentDate = `${formattedDate}T${selectedHour}:00`;

    const payload = {
      Id: "",
      DoctorId: selectedDoctorId,
      PatientId: patientId,
      SpecializationId: selectedSpecialization,
      DateAndTime: appointmentDate,
      AppointmentInfoList: [appointmentInfo],
    };

    try {
      await createAppointment(payload);
      handleSnackbarOpen("Appointment created successfully!", {
        vertical: "top",
        horizontal: "center",
      });
      handleClose();
    } catch (error) {
      console.error("Failed to create appointment:", error);
      handleSnackbarOpen("Failed to create appointment. Please try again.");
    }
  };

  const isDateValid = selectedDate !== null && !shouldDisableDate(selectedDate);

  return (
    <Grid container spacing={2} height={"100%"}>
      <Grid item xs={3}>
        <Stack
          m={1}
          p={2}
          border={"1px solid #f0f0f0"}
          borderRadius={"4px"}
          boxShadow={
            "0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)"
          }
          backgroundColor={"white"}
        >
          <Typography variant="h5" textAlign={"center"} mb={2}>
            Filters
          </Typography>
          <FormControl
            sx={{
              minWidth: 220,
              flex: 1,
              mb: 2,
            }}
          >
            <InputLabel id="degrees-select-label">Degree</InputLabel>
            <Select
              labelId="degree-label-id"
              id="degree-select"
              value={degreeIdFilter}
              label="Degree"
              onChange={handleChangeDegree}
            >
              {degrees.map((degree) => (
                <MenuItem key={degree.id} value={degree.id}>
                  {degree.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            sx={{
              minWidth: 220,
              flex: 1,
              mb: 2,
            }}
          >
            <InputLabel id="specializations-select-label">
              Specializations
            </InputLabel>
            <Select
              labelId="specializations-label-id"
              id="specializations-select"
              value={specializationIdFilter}
              label="Specialization"
              onChange={handleChangeSpecialization}
            >
              {specializations.map((spec) => (
                <MenuItem key={spec.id} value={spec.id}>
                  {spec.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            sx={{
              minWidth: 220,
              flex: 1,
              mb: 2,
            }}
          >
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by-select"
              value={sortBy}
              label="Sort By"
              onChange={handleChangeSortBy}
            >
              <MenuItem value="Name">Name</MenuItem>
              <MenuItem value="Degree">Degree</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={handleToggleSortOrder}
              variant="contained"
              sx={{ flex: 1, mb: 2 }}
            >
              {sortDesc ? "Descending" : "Ascending"}
            </Button>

            <Button
              onClick={handleResetFilters}
              variant="outlined"
              color="secondary"
              sx={{ flex: 1, mb: 2 }}
            >
              Reset Filters
            </Button>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={9} mt={1} px={1}>
        {doctorList.map((doctor) => {
          return (
            <Paper
              key={doctor.id}
              elevation={3}
              className="doctor-paper"
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Box>
                <img
                  src={doctor.photoId || "poza"}
                  alt={doctor.firstName}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    margin: "16px",
                    borderRadius: "4px",
                  }}
                />
              </Box>

              <Box
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" component="h2">
                  {doctor.firstName} {doctor.lastName}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Degree: {doctor.degreeName}
                </Typography>
                <Typography variant="body2" component="p">
                  Specializations:{" "}
                  {doctor.specializationsList
                    .map((spec) => spec.text)
                    .join(", ")}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen(doctor)}
                style={{ margin: "16px" }}
              >
                Book Now
              </Button>
            </Paper>
          );
        })}
      </Grid>

      <BookingConfirmationModal
        open={open}
        handleClose={handleClose}
        doctorSpecializations={doctorSpecializations}
        selectedSpecialization={selectedSpecialization}
        setSelectedSpecialization={setSelectedSpecialization}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        shouldDisableDate={shouldDisableDate}
        startHour={startHour}
        endHour={endHour}
        unavailableHours={unavailableHours}
        onSelectHour={onSelectHour}
        selectedHour={selectedHour}
        isDateValid={isDateValid}
        appointmentInfo={appointmentInfo}
        setAppointmentInfo={setAppointmentInfo}
        handleCreateAppointment={handleCreateAppointment}
      />
      <Snackbar
        anchorOrigin={snackbarPosition}
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        autoHideDuration={3000}
        key={snackbarPosition.vertical + snackbarPosition.horizontal}
      />
    </Grid>
  );
};

export default AllDoctors;
