import * as React from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, Box, Button } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function CardHomePageDoctor() {
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
                  Manage your appointments. Schedule, view, or update your
                  appointments.
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
          <Link to="/createProgram" style={{ textDecoration: "none" }}>
            <CardActionArea>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  color="primary"
                >
                  <ScheduleIcon sx={{ mr: 1 }} />
                  Program
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and manage your work schedule. Update your availability
                  and working hours.
                </Typography>
                <Box mt={2}>
                  <Button variant="contained" color="primary">
                    Manage Program
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
          <Link to="/profile" style={{ textDecoration: "none" }}>
            <CardActionArea>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  color="primary"
                >
                  <AttachMoneyIcon sx={{ mr: 1 }} />
                  Prices
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage the pricing for your services. Update your consultation
                  fees and service rates.
                </Typography>
                <Box mt={2}>
                  <Button variant="contained" color="primary">
                    Manage Prices
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
