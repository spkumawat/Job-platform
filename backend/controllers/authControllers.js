const jwt = require('jsonwebtoken');

const User = require('../models/User');  // Ensure path to User model is correct

// Signup handler
const signUp = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const newUser = await User.createNewUser({
            username,
            email,
            password,
            role
        });
        // Generate a token
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }  // Expiry can be adjusted based on your requirements
        );

        res.status(201).send({ message: 'Signup successful', user: newUser, token });
    } catch (error) {
        res.status(400).send({ error: 'Signup failed', message: error.message });
    }
};

// Login handler
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {  // Assuming plain text comparison for demo purposes
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }  // Token expires in 24 hours
        );

        res.send({ message: 'Login successful', user: { id: user._id, email: user.email, role: user.role }, token });
    } catch (error) {
        res.status(500).send({ message: 'Login error', error: error.message });
    }
};

const validateUser = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Authorization token is required' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        

        const user = await User.findById(userId).select('-password');  // Exclude password from the results
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({
            message: 'User validated successfully',
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(403).send({ message: 'Invalid token', error: error.message });
        } else if (error.name === "TokenExpiredError") {
            return res.status(403).send({ message: 'Token has expired', error: error.message });
        }
        res.status(500).send({ message: 'Failed to validate token', error: error.message });
    }
};

module.exports = {
    signUp,
    login,
    validateUser
};
