import * as React from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, Box, Button } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

export default function CardHomePagePatient() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          "&:hover": {
            transform: "scale(1.05)",
          },
          transition: "transform 0.2s ease-in-out",
        }}
      >
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            background: "linear-gradient(to right, #ffffff, #f8f9fa)",
          }}
        >
          <Link to="/appointments" style={{ textDecoration: "none" }}>
            <CardActionArea>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  color="primary"
                >
                  <EventIcon sx={{ mr: 1 }} />
                  Appointments
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your appointments here. Book, reschedule, or cancel
                  appointments with ease.
                </Typography>
                <Box mt={2}>
                  <Button variant="contained" color="primary">
                    Manage Appointments
                  </Button>
                </Box>
              </CardContent>
            </CardActionArea>
          </Link>
        </Card>
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          "&:hover": {
            transform: "scale(1.05)",
          },
          transition: "transform 0.2s ease-in-out",
        }}
      >
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            background: "linear-gradient(to right, #ffffff, #f8f9fa)",
          }}
        >
          <Link to="/doctors" style={{ textDecoration: "none" }}>
            <CardActionArea>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  color="primary"
                >
                  <LocalHospitalIcon sx={{ mr: 1 }} />
                  Doctors
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View all available doctors. Make a booking with the doctor of
                  your choice.
                </Typography>
                <Box mt={2}>
                  <Button variant="contained" color="primary">
                    View Doctors
                  </Button>
                </Box>
              </CardContent>
            </CardActionArea>
          </Link>
        </Card>
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          "&:hover": {
            transform: "scale(1.05)",
          },
          transition: "transform 0.2s ease-in-out",
        }}
      >
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            background: "linear-gradient(to right, #ffffff, #f8f9fa)",
          }}
        >
          <Link to="/specializations" style={{ textDecoration: "none" }}>
            <CardActionArea>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  color="primary"
                >
                  <MedicalServicesIcon sx={{ mr: 1 }} />
                  Specializations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explore all available medical specializations. Find the right
                  specialist for your needs.
                </Typography>
                <Box mt={2}>
                  <Button variant="contained" color="primary">
                    View Specializations
                  </Button>
                </Box>
              </CardContent>
            </CardActionArea>
          </Link>
        </Card>
      </Box>
    </Box>
  );
}
