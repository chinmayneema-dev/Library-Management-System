const { body, param } = require('express-validator');

const changeOwnPasswordValidator = [
  body('currentPassword').isString().isLength({ min: 6 }).withMessage('Current password required'),
  body('newPassword').isString().isLength({ min: 6 }).withMessage('New password must be at least 6 chars'),
];

const adminResetPasswordValidator = [
  param('userId').isInt({ min: 1 }).withMessage('Valid userId is required'),
  body('newPassword').isString().isLength({ min: 6 }).withMessage('New password must be at least 6 chars'),
];

module.exports = {
  changeOwnPasswordValidator,
  adminResetPasswordValidator,
};






