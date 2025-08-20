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
 * It persists the user in localStorage so that a page refresh keeps you logged in.
 */
export function AuthProvider({ children }) {
  // Initialise state from localStorage if present
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Save user after successful login
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * Clears the user and ensures the page refreshes to the login route.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');

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
