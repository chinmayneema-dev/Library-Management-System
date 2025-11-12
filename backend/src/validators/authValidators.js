const { body } = require('express-validator');

const loginValidator = [
  body('username').isString().trim().isLength({ min: 3 }).withMessage('Username is required'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password is required'),
];

module.exports = {
  loginValidator,
};







