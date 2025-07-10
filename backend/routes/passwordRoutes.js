const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');
const { protect } = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/request-reset', passwordController.requestPasswordReset);
router.post('/reset', passwordController.resetPassword);

// Protected routes (authentication required)
router.post('/change', protect, passwordController.changePassword);
router.post('/request-change-otp', protect, passwordController.requestPasswordChangeOTP);
router.post('/change-with-otp', protect, passwordController.changePasswordWithOTP);

module.exports = router; 