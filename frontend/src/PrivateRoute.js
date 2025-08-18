import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function PrivateRoute({ roles, element }) {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/login" />;
  }
  return element;
}

export default PrivateRoute;