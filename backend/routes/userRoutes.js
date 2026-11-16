javascript
const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.get('/discover', verifyToken, userController.getAllUsers);
router.get('/:userId', userController.getUserById);

module.exports = router;
