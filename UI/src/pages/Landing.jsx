import React, { useState } from "react";
import Paths from "../statics/Paths";
import { Link } from "react-router-dom";
import "../styles/Landing.css";
import { Grid } from "@mui/material";
import SignIn from "./Auth/SingIn";
import SignUp from "./Auth/SignUp";
import welcomeImage from "../components/infrastructure/landing_background.jpg";

const Landing = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <Grid
      container
      width={"100%"}
      height={"100vh"}
      style={{
        backgroundImage: `url(${welcomeImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Grid
        item
        xs={12}
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Grid container item xs={6} justifyContent="center">
          {isLogin ? (
            <SignIn setIsLogin={setIsLogin} />
          ) : (
            <SignUp setIsLogin={setIsLogin} />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Landing;
