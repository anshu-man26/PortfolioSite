const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getProjects,
  getProject,
  createProject,
  updateProjectOrder,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Protected admin routes
router.post('/', protect, upload.single('image'), createProject);
router.put('/order/update', protect, updateProjectOrder);
router.put('/:id', protect, upload.single('image'), updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router; 