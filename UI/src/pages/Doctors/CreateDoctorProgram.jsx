import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Divider,
  FormControl,
  InputLabel,
} from "@mui/material";
import useDoctorService from "../../services/DoctorService";
import "../../styles/DoctorProgramForm.css";

const DoctorProgramForm = () => {
  const { createDoctorProgram, getDoctorPrograms, getReasons } =
    useDoctorService();

  const [doctorProgram, setDoctorProgram] = useState([]);
  const [unavailablePeriods, setUnavailablePeriods] = useState([]);
  const [unavailableReasons, setUnavailableReasons] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);

  const [programFormData, setProgramFormData] = useState([]);
  const [unavailablePeriodsFormData, setUnavailablePeriodsFormData] = useState(
    []
  );

  const fetchDoctorProgram = async () => {
    try {
      const { doctorProgramList, unavailablePeriods } =
        await getDoctorPrograms();
      const reasons = await getReasons();

      setDoctorProgram(doctorProgramList);
      setUnavailablePeriods(unavailablePeriods);
      setUnavailableReasons(reasons);

      setProgramFormData(
        doctorProgramList.map((program) => ({
          id: program.id || "",
          doctorId: program.doctorId || "",
          startingHour: program.startingHour || "",
          endingHour: program.endingHour || "",
          dayOfWeek: program?.dayOfWeek,
        }))
      );

      setUnavailablePeriodsFormData(
        unavailablePeriods.map((period) => ({
          id: period.id || "",
          doctorId: period.doctorId || "",
          reasonId: period.reasonId || "",
          startingDay: period.startingDay || "",
          endingDay: period.endingDay || "",
          dayOfWeek: period?.dayOfWeek,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch doctor program:", error);
    }
  };

  useEffect(() => {
    fetchDoctorProgram();
  }, []);

  const handleProgramInputChange = (e) => {
    const { name, value } = e.target;
    const [index, propName] = name.split(".");
    const newProgramData = [...programFormData];
    newProgramData[index][propName] = `${value}:00`;
    setProgramFormData(newProgramData);
  };

  const handleUnavailableInputChange = (e) => {
    const { name, value } = e.target;
    const [index, propName] = name.split(".");
    const newUnavailableData = [...unavailablePeriodsFormData];
    newUnavailableData[index][propName] = value;
    setUnavailablePeriodsFormData(newUnavailableData);
  };

  const handleReasonChange = (index, value) => {
    const newUnavailableData = [...unavailablePeriodsFormData];
    newUnavailableData[index]["reasonId"] = value;
    setUnavailablePeriodsFormData(newUnavailableData);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDoctorProgram({
        ProgramList: programFormData,
        UnavailableList: unavailablePeriodsFormData,
      });
      setSuccessMessage(
        "Doctor program and unavailable period saved successfully!"
      );
      setError(null);
    } catch (error) {
      console.error(
        "Failed to save doctor program or unavailable period:",
        error
      );
      setError("Failed to save doctor program or unavailable period.");
    }
  };

  return (
    <Box>
      <Box
        sx={{
          padding: 3,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" gutterBottom textAlign="center">
          Create or Edit Doctor Program and Unavailable Period
        </Typography>
        {successMessage && (
          <Typography
            variant="body1"
            color="success.main"
            sx={{ mb: 2, textAlign: "center" }}
          >
            {successMessage}
          </Typography>
        )}
        {error && (
          <Typography
            variant="body1"
            color="error.main"
            sx={{ mb: 2, textAlign: "center" }}
          >
            {error}
          </Typography>
        )}

        <form onSubmit={handleFormSubmit} className="parent">
          {doctorProgram.map((program, index) => (
            <Box
              key={program.id}
              className="item"
              sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Day of Week: <strong>{program.dayOfWeek}</strong>
              </Typography>
              <FormControl fullWidth>
                <TextField
                  type="time"
                  label="Starting Hour"
                  name={`${index}.startingHour`}
                  value={programFormData[index]?.startingHour || ""}
                  onChange={handleProgramInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  type="time"
                  label="Ending Hour"
                  name={`${index}.endingHour`}
                  value={programFormData[index]?.endingHour || ""}
                  onChange={handleProgramInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Box>
          ))}

          {unavailablePeriods.length > 0 && (
            <Typography variant="h6" gutterBottom className="full-width">
              Unavailable Period (Optional)
            </Typography>
          )}

          {unavailablePeriods.map((period, index) => (
            <Box
              key={period.id}
              className="item"
              sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}
            >
              <FormControl fullWidth>
                <InputLabel>Reason</InputLabel>
                <Select
                  name={`${index}.reasonId`}
                  value={unavailablePeriodsFormData[index]?.reasonId || ""}
                  onChange={(e) => handleReasonChange(index, e.target.value)}
                >
                  <MenuItem value="">Select a reason (optional)</MenuItem>
                  {unavailableReasons.length > 0 ? (
                    unavailableReasons.map((reason) => (
                      <MenuItem key={reason.id} value={reason.id}>
                        {reason.reason}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      Loading reasons...
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  type="date"
                  label="Starting Day"
                  name={`${index}.startingDay`}
                  value={unavailablePeriodsFormData[index]?.startingDay || ""}
                  onChange={handleUnavailableInputChange}
                  disabled={!unavailablePeriodsFormData[index]?.reasonId}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  type="date"
                  label="Ending Day"
                  name={`${index}.endingDay`}
                  value={unavailablePeriodsFormData[index]?.endingDay || ""}
                  onChange={handleUnavailableInputChange}
                  disabled={!unavailablePeriodsFormData[index]?.reasonId}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Box>
          ))}

          <Box textAlign="center" mt={3} className="full-width">
            <Button type="submit" variant="contained" color="primary">
              Save Program and Unavailable Period
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default DoctorProgramForm;
