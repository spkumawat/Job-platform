// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/authContext'; // Import the hook from context
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/SignUp';
import RecruiterDashboard from './components/RecruiterDashboard';
import CandidateDashboard from './components/CandidateDashboard';
import PrivateRoute from './components/PrivateRoutes'; // Ensure this is imported correctly

function App() {
    const { isAuthenticated, user } = useAuth();

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={
                    <PrivateRoute>
                        {isAuthenticated ? 
                            (user?.role === 'Recruiter' ? <RecruiterDashboard /> : <CandidateDashboard />)
                            : <Navigate to="/login" replace />
                        }
                    </PrivateRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
