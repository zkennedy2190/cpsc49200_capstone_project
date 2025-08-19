// frontend/src/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// Export the context itself for compatibility with existing imports
export const AuthContext = createContext(null);

/**
 * Hook to access the authentication context
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * AuthProvider supplies login/logout functions and manages the current user.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Save user after successful login
  const login = (userData) => {
    setUser(userData);
  };

  /**
   * Clears the user and ensures the page refreshes to the login route.
   * If the user is already on the login page, call reload to force a refresh.
   */
  const logout = () => {
    setUser(null);

    // If already on the login page, reload to show the refresh.
    if (window.location.pathname === '/login') {
      window.location.reload();
    } else {
      // Otherwise, navigate to login and the browser will reload automatically.
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
