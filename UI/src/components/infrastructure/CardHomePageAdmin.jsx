import * as React from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea, Box, Button } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function CardHomePageAdmin() {
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
          <Link to="/list" style={{ textDecoration: "none" }}>
            <CardActionArea>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  color="primary"
                >
                  <PeopleIcon sx={{ mr: 1 }} />
                  Users List
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage the users. View, edit, or delete user accounts.
                </Typography>
                <Box mt={2}>
                  <Button variant="contained" color="primary">
                    Manage Users
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
          <Link to="/createDoctor" style={{ textDecoration: "none" }}>
            <CardActionArea>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  color="primary"
                >
                  <PersonAddIcon sx={{ mr: 1 }} />
                  Create Doctor Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add a new doctor to the system. Fill out the necessary details
                  to create a new doctor account.
                </Typography>
                <Box mt={2}>
                  <Button variant="contained" color="primary">
                    Create Account
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
