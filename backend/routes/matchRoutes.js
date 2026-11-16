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
```

---

**Step 12: Create Messaging Controller**

In `backend/controllers/messageController.js`:

```javascript
const { pool } = require('../server');

// Send Message
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const { matchId, content } = req.body;

    if (!content || !matchId) {
      return res.status(400).json({ error: 'Content and matchId required' });
    }

    // Verify match exists and user is part of it
    const matchResult = await pool.query(
      'SELECT * FROM matches WHERE id = $1 AND (user_id_1 = $2 OR user_id_2 = $2)',
      [matchId, senderId]
    );

    if (matchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Insert message
    const result = await pool.query(
      'INSERT INTO messages (match_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *',
      [matchId, senderId, content]
    );

    res.status(201).json({
      message: 'Message sent',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Messages for a Match
exports.getMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const { matchId } = req.params;

    // Verify user is part of this match
    const matchResult = await pool.query(
      'SELECT * FROM matches WHERE id = $1 AND (user_id_1 = $2 OR user_id_2 = $2)',
      [matchId, userId]
    );

    if (matchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Match
