const express = require('express');
const authController = require('../controllers/authController');
const { loginValidator } = require('../validators/authValidators');
const handleValidation = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/login', loginValidator, handleValidation, authController.login);

module.exports = router;







