// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import '../Design/Header.css';

function Header() {
    const { isAuthenticated, user, logout } = useAuth();  // Extract logout here

    return (
        <header  className="fixed-header">
            <nav>
            <div className="header-middle" style={{ marginLeft: '150px' }}>
            <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold' }}>Job Portal</Link>
            </div>


                {isAuthenticated && user ? (
                    <>
                        <span>{user.username}</span> {/* Ensure user is not null before accessing username */}
                        <button onClick={logout}>Logout</button> {/* Use logout directly */}
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup"  className="signup-link">Signup</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;
