// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function Header() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <header>
            <nav>
                {isAuthenticated ? (
                    <>
                        <span>{user.username}</span>
                        <button onClick={logout}>Logout</button>
                        {/* <Link to="/">Home</Link> */}
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;
