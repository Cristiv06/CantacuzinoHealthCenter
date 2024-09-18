import React from "react";
import { LoadingProvider } from "./LoaderContext";
import { AccountProvider } from "./AccountContext";
import { ToastContainer } from "react-toastify";

const AppProvider = ({ children }) => {
  return (
    <>
      <LoadingProvider>
        <AccountProvider>{children}</AccountProvider>
      </LoadingProvider>
    </>
  );
};

export default AppProvider;
