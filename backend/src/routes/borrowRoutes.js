const express = require('express');
const borrowController = require('../controllers/borrowController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const handleValidation = require('../middleware/validationMiddleware');
const { issueBookValidator, returnBookValidator } = require('../validators/borrowValidators');

const router = express.Router();

router.post('/issue', authenticate, authorize('LIBRARIAN'), issueBookValidator, handleValidation, borrowController.issueBook);
router.post('/return', authenticate, authorize('LIBRARIAN'), returnBookValidator, handleValidation, borrowController.returnBook);
router.get('/', authenticate, borrowController.listBorrowRecords);

module.exports = router;







