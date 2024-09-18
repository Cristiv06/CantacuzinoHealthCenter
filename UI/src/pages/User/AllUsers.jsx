import React, { useState, useEffect } from "react";
import useAuthService from "../../services/UserService";
import {
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import backgroundImage from "../../components/infrastructure/homePageBackground.jpg";

const AllUsers = () => {
  const { getAllUsers, deactivateUser } = useAuthService();
  const [users, setUsers] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleDeactivate = (userId) => {
    deactivateUser(userId)
      .then((result) => {
        if (result === 1) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === userId ? { ...user, isActive: false } : user
            )
          );
          setSnackbarMessage("User successfully deactivated.");
          setSnackbarSeverity("success");
        } else {
          setSnackbarMessage("Failed to deactivate user.");
          setSnackbarSeverity("error");
        }

        setOpenSnackbar(true);
      })
      .catch((error) => {
        setSnackbarMessage("Failed to deactivate user.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        console.error("Failed to deactivate user:", error);
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md">
      <h1>All Users</h1>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <List>
          {users.map((user) => (
            <ListItem
              key={user.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ListItemText
                primary={`Name: ${user.firstName} ${user.lastName}`}
                secondary={`ID: ${user.id} | Email: ${user.email} | Active: ${
                  user.isActive ? "Yes" : "No"
                }`}
              />

              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDeactivate(user.id)}
              >
                Deactivate User
              </Button>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AllUsers;
