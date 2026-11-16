javascript
const express = require('express');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route example
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Protected route', userId: req.userId });
});

module.exports = router;
```
