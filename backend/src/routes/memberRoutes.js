const express = require('express');
const memberController = require('../controllers/memberController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const handleValidation = require('../middleware/validationMiddleware');
const { createMemberValidator } = require('../validators/memberValidators');

const router = express.Router();

router.post('/', authenticate, authorize('LIBRARIAN'), createMemberValidator, handleValidation, memberController.addMember);
router.get('/', authenticate, memberController.listMembers);
router.get('/:id', authenticate, memberController.getMember);
router.get('/:id/history', authenticate, memberController.getMemberBorrowHistory);

module.exports = router;







