const express = require('express');
const bookController = require('../controllers/bookController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const handleValidation = require('../middleware/validationMiddleware');
const { createBookValidator, updateBookValidator, searchBooksValidator } = require('../validators/bookValidators');

const router = express.Router();

router.post('/', authenticate, authorize('LIBRARIAN'), createBookValidator, handleValidation, bookController.addBook);
router.put('/:id', authenticate, authorize('LIBRARIAN'), updateBookValidator, handleValidation, bookController.updateBook);
router.delete('/:id', authenticate, authorize('LIBRARIAN'), bookController.deleteBook);
router.get('/', authenticate, bookController.listBooks);
router.get('/search', authenticate, searchBooksValidator, handleValidation, bookController.searchBooks);

module.exports = router;







