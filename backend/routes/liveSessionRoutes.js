javascript
const express = require('express');
const liveSessionController = require('../controllers/liveSessionController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Create live session
router.post('/create', verifyToken, liveSessionController.createLiveSession);

// Get active session for a match
router.get('/:matchId/active', verifyToken, liveSessionController.getActiveSession);

// Join live session
router.post('/:sessionId/join', verifyToken, liveSessionController.joinLiveSession);

// End live session
router.put('/:sessionId/end', verifyToken, liveSessionController.endLiveSession);

// Get session history
router.get('/:matchId/history', verifyToken, liveSessionController.getSessionHistory);

module.exports = router;
```
