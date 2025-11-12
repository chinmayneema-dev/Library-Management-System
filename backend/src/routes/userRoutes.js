const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const handleValidation = require('../middleware/validationMiddleware');
const { changeOwnPasswordValidator, adminResetPasswordValidator } = require('../validators/userValidators');

const router = express.Router();

// User changes own password
router.post(
  '/change-password',
  authenticate,
  changeOwnPasswordValidator,
  handleValidation,
  userController.changeOwnPassword
);

// Librarian resets any user's password
router.post(
  '/:userId/reset-password',
  authenticate,
  authorize('LIBRARIAN'),
  adminResetPasswordValidator,
  handleValidation,
  userController.adminResetPassword
);

module.exports = router;






