import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import userSession from "../../utils/userSession";
import { Link } from "react-router-dom";
import { useAccount } from "../../contexts/AccountContext";
import { List, ListItem, Modal, Select } from "@mui/material";
import { useTranslation } from "react-i18next";
import Paths from "../../statics/Paths";
import Roles from "../../statics/Roles";
import connection, {
  startConnection,
} from "../../pages/User/SignalRConnection";
import useNotificationService from "../../services/NotificationService";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { toast } from "react-toastify";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const pages =
  userSession.user()?.roleId === Roles.Doctor
    ? [
        {
          path: Paths.program,
          label: "Program",
        },
        {
          path: Paths.appointments,
          label: "Appointments",
        },
      ]
    : userSession.user()?.roleId === Roles.Patient
    ? [
        {
          path: Paths.allSpecializations,
          label: "Specializations",
        },
        {
          path: Paths.doctors,
          label: "Doctors",
        },
      ]
    : [];

const settings = [
  {
    path: Paths.profile,
    label: "Profile",
  },
];

function Navbar() {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const { i18n } = useTranslation();
  const [locale, setLocale] = React.useState("en");
  const [authState, setAuthState] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorNotif, setAnchorNotif] = React.useState(null);
  const { isAuth, setIsAuth } = useAccount();
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [notificationList, setNotificationList] = React.useState([]);
  const { getAllNotifications } = useNotificationService();

  const getData = async () => {
    let notifications = await getAllNotifications();
    setNotificationList(notifications);
    return notifications;
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event) => {
    setAnchorNotif(event.currentTarget);
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorNotif(null);
  };

  const handleModalState = (value) => {
    setModalIsOpen(value);
  };

  const notifyUser = (title, body) => {
    if (!("Notification" in window)) {
      alert("Browser does not support notifications");
    } else if (Notification.permission === "granted") {
      const notification = new Notification(title, { body });
    }
  };
  React.useEffect(() => {
    getData();
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission == "granted") {
          const notification = new Notification(
            "Your notifications are now enabled"
          );
        }
      });
    }
  }, []);

  React.useState(() => {
    connection.on("NewNotification", () => {
      getData().then((notifications) => {
        debugger;
        const latestNotification = notifications?.sort(function (a, b) {
          return new Date(b.NotifyDate) - new Date(a.NotifyDate);
        })?.[0];
        notifyUser("Appointment update", latestNotification?.message);
      });
    });
  }, []);

  React.useEffect(() => {
    setAuthState(isAuth);
    startConnection();
  }, [isAuth]); //de verificat

  const handleLogout = () => {
    handleModalState(false);
    setAnchorElUser(null);
    userSession.clearAuthSession();
    setIsAuth(false);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#ffffff",
        boxShadow: "none",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LocalHospitalIcon
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 2,
              color: "#1976d2",
            }}
          />
          <Link to="/" style={{ textDecoration: "none", color: "#1976d2" }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "#1976d2",
              }}
            >
              CHC
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="open drawer"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon sx={{ color: "#1976d2" }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <Link
                  key={page.label}
                  to={page.path}
                  style={{ textDecoration: "none", color: "#1976d2" }}
                >
                  <Typography sx={{ p: 2, textAlign: "center" }}>
                    {page.label}
                  </Typography>
                </Link>
              ))}
            </Menu>
          </Box>

          <LocalHospitalIcon
            sx={{
              display: { xs: "flex", md: "none" },
              mr: 2,
              color: "#1976d2",
            }}
          />
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "#1976d2",
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Link
                key={page.label}
                to={page.path}
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                  padding: "0 16px",
                  lineHeight: "64px",
                }}
              >
                <Typography>{page.label}</Typography>
              </Link>
            ))}
          </Box>

          {authState ? (
            <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={handleOpenNotifications}
                sx={{ color: "#1976d2", mr: 2 }}
              >
                <NotificationsIcon />
              </IconButton>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorNotif}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorNotif)}
                onClose={handleCloseNotificationsMenu}
              >
                <Typography variant="h6" textAlign={"center"} mb={1}>
                  Notifications
                </Typography>
                {notificationList.length === 0 && (
                  <Box sx={{ p: 2, textAlign: "center", color: "#1976d2" }}>
                    You have no notifications
                  </Box>
                )}
                <List>
                  {notificationList.map((notification) => (
                    <Link
                      key={notification.id}
                      to="/appointments"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <ListItem button onClick={handleCloseNotificationsMenu}>
                        <Typography sx={{ color: "#1976d2" }}>
                          {notification.message}
                        </Typography>
                      </ListItem>
                    </Link>
                  ))}
                </List>
              </Menu>

              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <Link
                    key={setting.label}
                    to={setting.path}
                    style={{ textDecoration: "none", color: "#1976d2" }}
                  >
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography>{setting.label}</Typography>
                    </MenuItem>
                  </Link>
                ))}
                <MenuItem onClick={() => handleModalState(true)}>
                  <Typography sx={{ color: "#1976d2" }}>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Link
                to="/landing"
                style={{ textDecoration: "none", color: "#1976d2" }}
              >
                <Typography>Login or Register</Typography>
              </Link>
            </Box>
          )}
        </Toolbar>
      </Container>

      <Modal open={modalIsOpen} onClose={() => handleModalState(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            sx={{ color: "#1976d2" }}
          >
            Are you sure you want to logout?
          </Typography>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" color="primary" onClick={handleLogout}>
              Logout
            </Button>
            <Button variant="outlined" onClick={() => handleModalState(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </AppBar>
  );
}
export default Navbar;
