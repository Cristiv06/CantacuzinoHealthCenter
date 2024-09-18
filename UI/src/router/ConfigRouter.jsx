import { createBrowserRouter } from "react-router-dom";
import GeneralLayout from "../layout/GeneralLayout";
import React from "react";
import Home from "../pages/Home";
import Paths from "../statics/Paths";
import NotFound from "../pages/NotFound";
import AuthenticatedRoute from "../components/infrastructure/AuthenticatedRoute";
import DemoPage from "../pages/DemoPage";
import ErrorPage from "../pages/ErrorPage";
import ComponentsStyles from "../pages/ComponentsStyles";
import AllSpecializations from "../pages/Specializations/AllSpecializations";
import Profile from "../pages/User/Profile";
import AllDoctors from "../pages/Doctors/AllDoctors";
import DoctorProgram from "../pages/Doctors/DoctorPrograms";
import CreateDoctorProgram from "../pages/Doctors/CreateDoctorProgram";
import Appointments from "../pages/Appointments/Appointments";
import Notifications from "../pages/User/Notifications";
import Landing from "../pages/Landing";
import AllUsers from "../pages/User/AllUsers";
import CreateDoctorProfile from "../pages/Doctors/CreateDoctorProfile";

export default function configRouter() {
  return createBrowserRouter([
    {
      path: Paths.home,
      element: <GeneralLayout />,
      children: [
        {
          path: Paths.home,
          element: <Home />,
        },
        {
          path: Paths.landing,
          element: <Landing />,
        },
        {
          path: Paths.error,
          element: <ErrorPage />,
        },
        {
          path: Paths.allSpecializations,
          element: <AllSpecializations />,
        },
        {
          path: Paths.profile,
          element: (
            <AuthenticatedRoute>
              <Profile />
            </AuthenticatedRoute>
          ),
        },
        {
          path: Paths.doctors,
          element: <AllDoctors />,
        },
        {
          path: Paths.appointments,
          element: (
            <AuthenticatedRoute>
              <Appointments />
            </AuthenticatedRoute>
          ),
        },
        {
          path: Paths.program,
          element: (
            <AuthenticatedRoute>
              <DoctorProgram />
            </AuthenticatedRoute>
          ),
        },
        {
          path: Paths.createProgram,
          element: (
            <AuthenticatedRoute>
              <CreateDoctorProgram />
            </AuthenticatedRoute>
          ),
        },
        {
          path: Paths.notifications,
          element: (
            <AuthenticatedRoute>
              <Notifications />
            </AuthenticatedRoute>
          ),
        },
        {
          path: Paths.manageUsers,
          element: (
            <AuthenticatedRoute>
              <AllUsers />
            </AuthenticatedRoute>
          ),
        },
        {
          path: Paths.createDoctor,
          element: (
            <AuthenticatedRoute>
              <CreateDoctorProfile />
            </AuthenticatedRoute>
          ),
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);
}
