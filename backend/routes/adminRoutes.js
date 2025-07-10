const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { loginAdmin, getAdminProfile } = require('../controllers/adminController');
const upload = require('../middleware/upload');
const { getPortfolio, updatePortfolio, uploadCollegePfp, uploadSchoolPfp, uploadPersonalPfp } = require('../controllers/portfolioController');

// Public routes
router.post('/login', loginAdmin);

// Protected routes
router.get('/profile', protect, getAdminProfile);
router.get('/portfolio', protect, getPortfolio);
router.put('/portfolio', protect, updatePortfolio);
router.post('/college-pfp', protect, upload.single('image'), uploadCollegePfp);
router.post('/school-pfp', protect, upload.single('image'), uploadSchoolPfp);
router.post('/personal-pfp', protect, upload.single('image'), uploadPersonalPfp);

module.exports = router; 