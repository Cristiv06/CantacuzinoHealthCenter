import * as React from "react";
import Typography from "@mui/material/Typography";
import { Box, Grid, Stack } from "@mui/material";
import CardHomePagePatient from "../components/infrastructure/CardHomePagePatient";
import CardHomePageDoctor from "../components/infrastructure/CardHomePageDoctor";
import CardHomePageAdmin from "../components/infrastructure/CardHomePageAdmin";
import Roles from "../statics/Roles";
import userSession from "../utils/userSession";
import backgroundImage from "../components/infrastructure/homePageBackground.jpg";
import CardHomePageVisitor from "../components/infrastructure/CardHomePageVisitor";

export default function Home() {
  const userRole = userSession.user()?.roleId;

  const renderCardComponent = () => {
    if (userRole === Roles.Doctor) {
      return <CardHomePageDoctor />;
    } else if (userRole === Roles.Patient) {
      return <CardHomePagePatient />;
    } else if (userRole === Roles.Admin) {
      return <CardHomePageAdmin />;
    } else {
      return <CardHomePageVisitor />;
    }
  };

  return (
    <Grid
      container
      width={"100%"}
      height={"100%"}
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(5px)",
      }}
    >
      <Grid
        item
        xs={6}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Stack
          boxShadow="rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
          borderRadius="20px"
          padding="40px"
          border="1px solid #ebebeb"
          maxWidth="80%"
          bgcolor="white"
        >
          <Typography variant="h4" gutterBottom align="left" color="primary">
            Welcome to the Clinic
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            At our clinic, we are committed to providing you with the highest
            quality of care. Our team of experienced professionals is dedicated
            to ensuring your health and well-being are our top priorities.
            Whether you're here for a routine check-up or specialized treatment,
            we strive to make your visit as comfortable and efficient as
            possible.
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Explore our services, meet our doctors, and find the best care
            tailored to your needs. We look forward to assisting you on your
            journey to better health.
          </Typography>
        </Stack>
      </Grid>
      <Grid
        item
        xs={6}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {renderCardComponent()}
      </Grid>
    </Grid>
  );
}
