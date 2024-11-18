import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("authToken"); // Verifica o token nos cookies

  if (!token) {
    // Se não houver token, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  // Caso contrário, renderiza o componente filho
  return children;
};

// Validação de props
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // children deve ser passado e deve ser um React node
};

export default ProtectedRoute;
