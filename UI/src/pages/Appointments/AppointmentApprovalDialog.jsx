import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const AppointmentApprovalDialog = ({
  openModal,
  handleCloseModal,
  currentAppointment,
  isApproved,
  setIsApproved,
  handleApprove,
}) => {
  return (
    <Dialog
      open={openModal}
      onClose={handleCloseModal}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 2,
          padding: 2,
          maxWidth: 500,
          width: "100%",
          margin: "0 auto",
          boxShadow: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          backgroundColor: "primary.main",
          color: "white",
          padding: 2,
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
        }}
      >
        Update Appointment Approval
      </DialogTitle>
      <DialogContent sx={{ padding: 3 }}>
        {currentAppointment && (
          <Box sx={{ marginTop: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isApproved}
                  onChange={(e) => setIsApproved(e.target.checked)}
                  color="primary"
                />
              }
              label="Approved"
              sx={{ display: "flex", alignItems: "center", fontSize: "1rem" }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 2,
          backgroundColor: "#f5f5f5",
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={handleCloseModal}
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button variant="contained" color="success" onClick={handleApprove}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentApprovalDialog;
