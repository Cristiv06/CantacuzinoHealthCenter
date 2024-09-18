import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Snackbar,
  Alert,
} from "@mui/material";
import useReviewService from "../../services/ReviewService";
import useAuthService from "../../services/UserService";

const AppointmentReviewForm = ({
  open,
  onClose,
  appointment,
  onReviewSubmit,
}) => {
  const { leaveReview } = useReviewService();
  const { fetchDetails } = useAuthService();
  const [rating, setRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [patientId, setPatientId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const userDetails = await fetchDetails();
        if (userDetails && userDetails.id) {
          setPatientId(userDetails.id);
        } else {
          console.error("User details are missing or invalid.");
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    if (open) {
      loadUserDetails();
    }
  }, [open, fetchDetails]);

  const handleSubmit = async () => {
    if (!rating || reviewMessage.trim() === "") {
      setSnackbarMessage("Please provide a rating and review message.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (!appointment || !appointment.id) {
      setSnackbarMessage("Invalid appointment data.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const reviewData = {
      IdAppointment: appointment.id,
      IdPatient: patientId,
      Rating: rating,
      ReviewMessage: reviewMessage,
    };

    setSubmitting(true);

    try {
      await leaveReview(reviewData);
      setSnackbarMessage("Review submitted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onReviewSubmit();
      onClose();
    } catch (error) {
      console.error("Failed to submit review:", error);
      setSnackbarMessage("Failed to submit review. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 1,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" mb={2}>
            Leave a Review
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <Typography variant="subtitle1" mb={1}>
              Rating:
            </Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              precision={1}
            />
            <Typography variant="subtitle1" mt={2} mb={1}>
              Review Message:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={reviewMessage}
              onChange={(event) => setReviewMessage(event.target.value)}
            />
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AppointmentReviewForm;
