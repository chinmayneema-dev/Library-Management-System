const { body, query } = require('express-validator');

const createBookValidator = [
  body('title').isString().trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('author').isString().trim().isLength({ min: 1 }).withMessage('Author is required'),
  body('category').optional().isString().trim(),
  body('publisher').optional().isString().trim(),
  body('isbn').isString().trim().isLength({ min: 10 }).withMessage('ISBN is required'),
  body('status').optional().isIn(['AVAILABLE', 'ISSUED']),
];

const updateBookValidator = [
  body('title').optional().isString().trim(),
  body('author').optional().isString().trim(),
  body('category').optional().isString().trim(),
  body('publisher').optional().isString().trim(),
  body('isbn').optional().isString().trim().isLength({ min: 10 }),
  body('status').optional().isIn(['AVAILABLE', 'ISSUED']),
];

const searchBooksValidator = [
  query('title').optional().isString().trim(),
  query('author').optional().isString().trim(),
  query('category').optional().isString().trim(),
];

module.exports = {
  createBookValidator,
  updateBookValidator,
  searchBooksValidator,
};







