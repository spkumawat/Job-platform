import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({
    isAuthenticated: false,  // Default value
    user: null,
    login: () => {},
    logout: () => {}
});

export const AuthProvider = ({ children }) => {
    const initialToken = localStorage.getItem('token');
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(initialToken);
    const [isAuthenticated, setIsAuthenticated] = useState(!!initialToken);  // Optimistically set isAuthenticated

    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    const response = await axios.get('http://localhost:4000/users/validate', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data.data);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.log('Token validation failed:', error);
                    logout();
                }
            } else {
                setIsAuthenticated(false);
            }
        };

        validateToken();
    }, [token]);  // React on token changes

    const login = (newToken, newUser) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
