// frontend/src/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Export the context itself for legacy imports
export const AuthContext = createContext(null);

/**
 * Hook for consuming the auth context
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * AuthProvider supplies login/logout functionality and current user.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Called after successful login
  const login = (userData) => {
    setUser(userData);
  };

  /**
   * Logs the user out, then redirects to login and reloads the page.
   */
  const logout = () => {
    setUser(null);
    navigate('/login', { replace: true });
    // Force a full page reload to clear any residual state
    window.location.reload();
  };

  // Provide the context value
  const value = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
