import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const id = localStorage.getItem('userId');
        return token ? { token, role, id } : null;
    });

    const login = ({ token, role, id }) => {
        setUser({ token, role, id });
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('userId', id);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};