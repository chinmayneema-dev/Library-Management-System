const { body } = require('express-validator');

const createMemberValidator = [
  body('name').isString().trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isString().trim().isLength({ min: 7 }).withMessage('Phone is required'),
  body('address').optional().isString().trim(),
  body('membershipDate').optional().isISO8601().toDate(),
  body('password')
    .optional()
    .isString()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

module.exports = {
  createMemberValidator,
};







