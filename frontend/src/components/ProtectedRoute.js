import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    
    // Check if route requires a specific role
    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      // Redirect to their respective dashboard if unauthorized
      return <Navigate to={`/${decoded.role}/dashboard`} replace />;
    }

    return children;
  } catch (error) {
    // Invalid token
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
