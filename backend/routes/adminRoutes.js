const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, handleToggleBan } = require('../controllers/AdminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.use(protect); // Apply protect middleware first
router.use(isAdmin); // Ensure only admins can access

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/ban', handleToggleBan); // Route to ban/unban user

module.exports = router;
