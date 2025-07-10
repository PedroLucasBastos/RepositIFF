import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("authToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children; // Renderiza o conteúdo dentro da rota protegida
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
