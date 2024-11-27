const { body, validationResult } = require('express-validator');

// Validator for registration
const validateUser = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('password')
    .isLength({ min: 9 })
    .withMessage('Password must be at least 9 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validator for login
const validateLogin = [
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateUser, validateLogin };
