import React from "react";
import { Outlet } from "react-router-dom";
import { Stack } from "@mui/material";
import Navbar from "../components/infrastructure/Navbar";
import Footer from "../components/infrastructure/Footer";
import { ToastContainer } from "react-toastify";

const GeneralLayout = () => {
  return (
    <Stack position={"relative"} height={"100vh"}>
      <Navbar />
      <Stack height={"100%"} backgroundColor="#f5f5f5">
        <Outlet />
      </Stack>
    </Stack>
  );
};

//stack overflow={"hidden"}
export default GeneralLayout;
