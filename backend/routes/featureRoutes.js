const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
  updateFeatureOrder,
  toggleKeyFeature,
} = require('../controllers/featureController');

// Public routes
router.get('/', getFeatures);

// Protected admin routes
router.post('/', protect, upload.single('image'), createFeature);
router.put('/order/update', protect, updateFeatureOrder);
router.put('/:id/toggle-key', protect, toggleKeyFeature);
router.put('/:id', protect, upload.single('image'), updateFeature);
router.delete('/:id', protect, deleteFeature);

module.exports = router; 