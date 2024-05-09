// app.js or routes.js if you have a separate routing file

const express = require('express');
const { signUp , login, validateUser } = require('../controllers/authControllers');  // Make sure the path is correct

const router = express.Router();

// User signup route
router.post('/signup', signUp);
// Login route
router.post('/login', login);
// Validation route
router.get('/validate', validateUser);

module.exports = router;
