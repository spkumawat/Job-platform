// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import '../Design/Login.css' // Ensure this path matches your file structure

function Login() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const { login } = useAuth();  // This should include the logic to store the token in localStorage
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/users/login', credentials);
            const { token, user } = response.data;  // Destructure token and user data from response
            login(token, user);  // Update auth context and store token in localStorage
            console.log(token,user);
            navigate('/');  // Redirect to homepage after successful login
        } catch (error) {
            alert('Login failed: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={credentials.email}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;
