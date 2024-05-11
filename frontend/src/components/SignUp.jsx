// src/components/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext'; 
import '../Design/SignUp.css'
// Importing useAuth from AuthContext

function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: ''
    });
    const navigate = useNavigate();
    const { login } = useAuth(); // Using the login function from AuthContext to handle token

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/users/signup', formData);
            const { token, user } = response.data;
            login(token, user); // Set token in local storage and update auth state
            navigate('/'); // Redirect to home on successful signup
        } catch (error) {
            console.error('Signup failed:', error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Select Role</option>
                <option value="Recruiter">Recruiter</option>
                <option value="Candidate">Candidate</option>
            </select>
            <button type="submit">Sign Up</button>
        </form>
    );
}

export default Signup;
