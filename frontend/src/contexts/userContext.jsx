import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const userLogInName = createContext(null);
export const userLoginId = createContext(null);

export const UserProvider = ({ children }) => {
  const [loginId, setLoginId] = useState(null);
  const [loginName, setLoginName] = useState(null);

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const jwtToken = cookies.find((token) => token.startsWith("token="));
    if (jwtToken) {
      const decodedToken = jwtDecode(jwtToken.split("=")[1]);
      setLoginName(decodedToken.username);
      setLoginId(decodedToken.userId);
    } else {
      setLoginName(null);
      setLoginId(null);
    }
  }, []);

  return (
    <userLoginId.Provider value={{ loginId, setLoginId }}>
      <userLogInName.Provider value={{ loginName, setLoginName }}>
        {children}
      </userLogInName.Provider>
    </userLoginId.Provider>
  );
};
