import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({
    isAuthenticated: false,  // Default initial state
    user: null,
    login: () => {},
    logout: () => {}
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const initialToken = localStorage.getItem('token');
    const [token, setToken] = useState(initialToken);
    const [isAuthenticated, setIsAuthenticated] = useState(!!initialToken);

    useEffect(() => {
        if (token) {
            validateToken();
        } else {
            // Immediately reflect no authentication if there is no token
            setIsAuthenticated(false);
            setUser(null);
        }
    }, [token]); // Effect runs on token change

    const validateToken = async () => {
        try {
            const response = await axios.get('http://localhost:4000/users/validate', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data);
            setUser(response.data.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.log('Token validation failed:', error);
            logout();
        }
    };

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
