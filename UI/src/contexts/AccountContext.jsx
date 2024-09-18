import React, { createContext, useContext, useState, useEffect } from "react";
import userSession from "../utils/userSession";

const AccountContext = createContext();

const AccountProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);

  const store = {
    isAuth,
    setIsAuth,
  };

  useEffect(() => {
    setIsAuth(userSession.isAuthenticated());
  }, []);

  return (
    <AccountContext.Provider value={store}>{children}</AccountContext.Provider>
  );
};

const useAccount = () => useContext(AccountContext);

export { AccountProvider, AccountContext, useAccount };
