const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authControllers');
const { validateUser, validateLogin } = require('../validators/authValidators');

// Register route
router.post('/register', validateUser, register);

// Login route
router.post('/login', validateLogin, login);

module.exports = router;
