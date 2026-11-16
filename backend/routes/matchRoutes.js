`javascript
const express = require('express');
const matchController = require('../controllers/matchController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/create', verifyToken, matchController.createMatch);
router.put('/:matchId/accept', verifyToken, matchController.acceptMatch);
router.put('/:matchId/reject', verifyToken, matchController.rejectMatch);
router.get('/my-matches', verifyToken, matchController.getUserMatches);
router.get('/recommendations', verifyToken, matchController.getRecommendations);

module.exports = router;
