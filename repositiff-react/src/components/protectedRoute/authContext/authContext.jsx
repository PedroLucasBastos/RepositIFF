import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sincroniza o estado de autenticação com o cookie
  useEffect(() => {
    const token = Cookies.get("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const login = (token) => {
    Cookies.set("authToken", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("authToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
