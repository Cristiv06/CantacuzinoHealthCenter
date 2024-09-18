import React from "react";
import {
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import HourCarousel from "./HourCarousel";

const BookingConfirmationModal = ({
  open,
  handleClose,
  doctorSpecializations,
  selectedSpecialization,
  setSelectedSpecialization,
  selectedDate,
  setSelectedDate,
  shouldDisableDate,
  startHour,
  endHour,
  unavailableHours,
  onSelectHour,
  selectedHour,
  isDateValid,
  appointmentInfo,
  setAppointmentInfo,
  handleCreateAppointment,
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "90%",
          maxWidth: 600,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 2,
          padding: 2,
          overflow: "auto",
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Booking Confirmation
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Please confirm your booking details:
        </Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="select-specialization-label">
            Specialization
          </InputLabel>
          <Select
            labelId="select-specialization-label"
            id="select-specialization"
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            label="Specialization"
          >
            {doctorSpecializations.map((specialization, index) => (
              <MenuItem key={index} value={specialization.value}>
                {specialization.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Pick a date"
              value={selectedDate}
              shouldDisableDate={shouldDisableDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Box>

        <Box sx={{ mt: 3 }}>
          <HourCarousel
            startHour={startHour}
            endHour={endHour}
            unavailableHours={unavailableHours ?? []}
            onSelectHour={onSelectHour}
            selectedHour={selectedHour}
            isDateValid={isDateValid}
          />
        </Box>

        <TextField
          label="Appointment Information"
          multiline
          rows={4}
          fullWidth
          value={appointmentInfo}
          onChange={(e) => setAppointmentInfo(e.target.value)}
          sx={{ mt: 2 }}
        />

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            onClick={handleCreateAppointment}
            variant="contained"
            color="primary"
          >
            Confirm Appointment
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BookingConfirmationModal;
