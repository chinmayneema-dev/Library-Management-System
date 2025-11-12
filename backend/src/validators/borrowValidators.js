const { body } = require('express-validator');

const issueBookValidator = [
  body('bookId').isInt({ min: 1 }).withMessage('Valid bookId is required'),
  body('memberId').isInt({ min: 1 }).withMessage('Valid memberId is required'),
  body('issueDate').optional().isISO8601().toDate(),
  body('dueDate').isISO8601().toDate().withMessage('Valid due date is required'),
];

const returnBookValidator = [
  body('borrowId').isInt({ min: 1 }).withMessage('Valid borrowId is required'),
  body('returnDate').optional().isISO8601().toDate(),
];

module.exports = {
  issueBookValidator,
  returnBookValidator,
};







