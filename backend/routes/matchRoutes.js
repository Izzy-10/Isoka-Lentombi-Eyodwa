`javascript
const express = require('express');
const matchController = require('../controllers/matchController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Create a match (like someone)
router.post('/create', verifyToken, matchController.createMatch);

// Accept a match
router.put('/:matchId/accept', verifyToken, matchController.acceptMatch);

// Reject a match
router.put('/:matchId/reject', verifyToken, matchController.rejectMatch);

// Get all matches for current user
router.get('/my-matches', verifyToken, matchController.getUserMatches);

// Get recommendations (algorithm-based)
router.get('/recommendations', verifyToken, matchController.getRecommendations);

module.exports = router;
