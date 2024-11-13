// src/PrivateRoute.js
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  // Redirect to the login page with the intended path (only as a string)
  return currentUser ? children : <Navigate to="/login" state={{ from: window.location.pathname }} />;
};

export default PrivateRoute;
