import React, { useEffect, useState } from "react";
import useAppointmentService from "../../services/AppointmentService";
import useAuthService from "../../services/UserService";
import useDocumentService from "../../services/DocumentService";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AppointmentApprovalDialog from "./AppointmentApprovalDialog";
import AppointmentReviewForm from "./AppointmentReviewForm";
import Rating from "@mui/material/Rating";
import {
  CircularProgress,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Grid,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import userSession from "../../utils/userSession";
const Appointments = () => {
  const { getAppointments, setAppointmentState, deleteAppointment } =
    useAppointmentService();
  const { uploadDocument, downloadDocument } = useDocumentService();
  const { fetchDetails } = useAuthService();
  const [appointments, setAppointments] = useState([]);
  const [currentUploadingAppointmentId, setCurrentUploadingAppointmentId] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [roleId, setRoleId] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarPosition, setSnackbarPosition] = useState({
    vertical: "top",
    horizontal: "center",
  });
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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
    const fetchData = async () => {
      try {
        const userDetails = await fetchDetails();
        const userRoleId = userDetails.roleId;
        setRoleId(userRoleId);

        const data = await getAppointments();

        let updatedAppointments = [];
        const appointmentPromises = data.map(async (appointment) => {
          let doctorPic = "";
          let patientPic = "";
          if (
            appointment.doctorPhotoId &&
            appointment.doctorPhotoId !== "00000000-0000-0000-0000-000000000000"
          ) {
            doctorPic = await getPicture(appointment.doctorPhotoId);
          }

          if (
            appointment.patientPhotoId &&
            appointment.patientPhotoId !==
              "00000000-0000-0000-0000-000000000000"
          ) {
            patientPic = await getPicture(appointment.patientPhotoId);
          }
          return {
            ...appointment,
            doctorPhotoUrl: doctorPic,
            patientPhotoUrl: patientPic,
          };
        });
        for (const apptPromise of appointmentPromises) {
          const updatedAppointment = await apptPromise;
          updatedAppointments.push(updatedAppointment);
          setAppointments([...updatedAppointments]);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenReviewModal = (appointment) => {
    setSelectedAppointment(appointment);
    setReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await leaveReview(reviewData);
      await fetchAppointments();
      onClose();
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handleOpenModal = (appointment) => {
    setCurrentAppointment(appointment);
    setIsApproved(appointment.isApproved || false);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentAppointment(null);
  };

  const handleApprove = async () => {
    if (currentAppointment) {
      try {
        await setAppointmentState({
          id: currentAppointment.id,
          isApproved: isApproved,
        });
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.id === currentAppointment.id
              ? { ...appointment, isApproved }
              : appointment
          )
        );
        handleCloseModal();
      } catch (err) {
        setError("Failed to update appointment.");
      }
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await deleteAppointment(appointmentId);
      setAppointments((prevAppointments) =>
        prevAppointments.filter(
          (appointment) => appointment.id !== appointmentId
        )
      );
    } catch (err) {
      setError("Failed to delete appointment.");
    }
  };

  const handleCancelClick = (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      handleDeleteAppointment(appointmentId);
    }
  };

  const handleFileChange = (event, appointmentId) => {
    setFile(event.target.files[0]);
    setCurrentUploadingAppointmentId(appointmentId);
  };

  const handleUpload = async (idAppointment) => {
    if (!file) {
      return;
    }
    setUploading(true);
    await uploadDocument({ file, idAppointment });
    setUploading(false);
    setFile(null);
    setSnackbarOpen(true);
    setSnackbarMessage("File uploaded successfully");
    const data = await getAppointments();
    setAppointments(data);
  };

  const handleDownload = async (fileId) => {
    axios({
      url: `${import.meta.env.VITE_API_URL}/storage/download/` + fileId,
      method: "GET",
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${userSession.token()}`,
        ContentType: "application/json",
      },
    }).then((response) => {
      const href = URL.createObjectURL(response.data);
      const contentDisposition = response.headers["content-disposition"];
      let filename = "downloaded_file";
      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = contentDisposition
          .split("filename=")[1]
          .split(";")[0]
          .replace(/['"]/g, "");
      }
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", filename);
      link.click();

      URL.revokeObjectURL(href);
    });
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", margin: "0 auto" }} />;
  if (error)
    return (
      <Typography sx={{ color: "error.main", textAlign: "center", mt: 2 }}>
        {error}
      </Typography>
    );

  const fileCss = `
    .file-download {
        padding: 5px 7px;
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, .2);
        border-radius: 14px;
        color: #1976d2;
        text-decoration: none;
        cursor: pointer;
    }

    .file-download:hover {
      text-decoration: underline;
      box-shadow: 0 0 5px 0 rgba(0, 0, 0, .35);
    }
`;

  return (
    <>
      <style>{fileCss}</style>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          padding: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            width: "100%",
            padding: 2,
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: 3,
            maxHeight: "100%",
            overflowY: "auto",
            height: "100%",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            color="primary"
          >
            My Appointments
          </Typography>
          {appointments.length === 0 ? (
            <Typography sx={{ textAlign: "center", mt: 2 }}>
              No appointments found.
            </Typography>
          ) : (
            appointments.map((appointment) => (
              <Grid
                container
                key={appointment.id}
                spacing={2}
                sx={{ marginBottom: 4 }}
              >
                <Grid item xs={4}>
                  <Box>
                    <img
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                      src={
                        roleId === 2
                          ? appointment.patientPhotoUrl ||
                            "default-patient-avatar-url"
                          : appointment.doctorPhotoUrl ||
                            "default-doctor-avatar-url"
                      }
                      alt={roleId === 2 ? "Patient Photo" : "Doctor Photo"}
                    />
                  </Box>
                </Grid>
                <Grid item xs={8}>
                  <Stack>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography color="textSecondary">
                          <span style={{ fontWeight: "bold" }}>Doctor:</span>{" "}
                          {appointment?.doctorName}
                        </Typography>
                        <Typography color="textSecondary">
                          <span style={{ fontWeight: "bold" }}>Patient:</span>{" "}
                          {appointment?.patientName}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography color="textSecondary">
                          <span style={{ fontWeight: "bold" }}>
                            Date and Time:
                          </span>{" "}
                          {new Date(appointment.dateAndTime).toLocaleString()}
                        </Typography>
                        <Typography color="textSecondary">
                          <span style={{ fontWeight: "bold" }}>Price:</span>{" "}
                          {appointment.price}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Box mb={1}>
                      <Typography color="textSecondary" display={"flex"}>
                        <span style={{ fontWeight: "bold" }}>Approved:</span>
                        {appointment.isApproved ? (
                          <CheckCircleOutlinedIcon />
                        ) : (
                          <ClearOutlinedIcon />
                        )}
                      </Typography>
                      <Typography color="textSecondary">
                        <span style={{ fontWeight: "bold" }}>File:</span>{" "}
                        {Array.isArray(appointment?.appointmentFiles) &&
                        appointment.appointmentFiles.length > 0
                          ? appointment.appointmentFiles
                              .map((file, index) => (
                                <span
                                  key={index}
                                  className="file-download"
                                  onClick={() => handleDownload(file.id)}
                                >
                                  {file.fileName}
                                </span>
                              ))
                              .reduce((prev, curr) => [prev, ", ", curr])
                          : "None"}
                      </Typography>
                    </Box>
                    <Box mb={1}>
                      {appointment.reviews && appointment.reviews.length > 0 ? (
                        appointment.reviews.map((review, index) => (
                          <Box key={index} mb={2}>
                            <Typography color="textSecondary">
                              <span style={{ fontWeight: "bold" }}>
                                Rating:
                              </span>{" "}
                              <Rating
                                name="read-only"
                                value={review.rating}
                                precision={0.5}
                                readOnly
                              />
                            </Typography>
                            <Typography color="textSecondary">
                              <span style={{ fontWeight: "bold" }}>
                                Review:
                              </span>{" "}
                              {review.reviewMessage}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography color="textSecondary">
                          No reviews yet.
                        </Typography>
                      )}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        columnGap: "10px",
                      }}
                    >
                      <Button variant="contained" component="label">
                        Choose File
                        <input
                          type="file"
                          hidden
                          onChange={(event) =>
                            handleFileChange(event, appointment.id)
                          }
                        />
                      </Button>
                      {file &&
                        currentUploadingAppointmentId === appointment.id && (
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => handleUpload(appointment.id)}
                            disabled={uploading}
                          >
                            {uploading ? "Uploading..." : "Confirm"}
                          </Button>
                        )}
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleCancelClick(appointment.id)}
                      >
                        Cancel Appointment
                      </Button>
                      {roleId === 2 && (
                        <Button
                          size="small"
                          variant="contained"
                          color={appointment.isApproved ? "warning" : "success"}
                          onClick={() => handleOpenModal(appointment)}
                        >
                          {appointment.isApproved
                            ? "Revoke Approval"
                            : "Approve"}
                        </Button>
                      )}
                      {roleId === 1 && (
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenReviewModal(appointment)}
                        >
                          Leave Review
                        </Button>
                      )}
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            ))
          )}
          <AppointmentApprovalDialog
            openModal={openModal}
            handleCloseModal={handleCloseModal}
            currentAppointment={currentAppointment}
            isApproved={isApproved}
            setIsApproved={setIsApproved}
            handleApprove={handleApprove}
          />
          <AppointmentReviewForm
            open={reviewModalOpen}
            onClose={handleCloseReviewModal}
            appointment={selectedAppointment}
            onReviewSubmit={handleReviewSubmit}
          />
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </>
  );
};

export default Appointments;
