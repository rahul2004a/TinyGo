import { createContext, useContext, useState } from "react";
import { getUserFromToken } from "../utils/helper";

const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
  const getToken = localStorage.getItem("JWT_TOKEN")
    ? JSON.parse(localStorage.getItem("JWT_TOKEN"))
    : null;

  // Extract user from token if available
  const getUserFromTokenData = (token) => {
    if (token) {
      return getUserFromToken(token);
    }
    return localStorage.getItem("USER_DATA")
      ? JSON.parse(localStorage.getItem("USER_DATA"))
      : null;
  };

  const [token, setToken] = useState(getToken);
  const [user, setUser] = useState(getUserFromTokenData(getToken));

  const sendData = {
    token,
    setToken,
    user,
    setUser,
  };

  return <ContextApi.Provider value={sendData}>{children}</ContextApi.Provider>;
};

export const useStoreContext = () => {
  const context = useContext(ContextApi);
  return context;
};
