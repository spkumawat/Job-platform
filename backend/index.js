require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const authenticateJWT = require('./middleware/authMiddleware');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json());

// Authenticaation routes
app.use('/users', authRoutes);

// Job routes
app.use('/jobs', jobRoutes); 


