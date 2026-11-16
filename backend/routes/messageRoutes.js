javascript
const express = require('express');
const messageController = require('../controllers/messageController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Send a message
router.post('/send', verifyToken, messageController.sendMessage);

// Get messages for a specific match
router.get('/:matchId', verifyToken, messageController.getMessages);

// Get all conversations
router.get('/', verifyToken, messageController.getConversations);

// Delete a message
router.delete('/:messageId', verifyToken, messageController.deleteMessage);

module.exports = router;
```

---

**Step 15: Add Message Routes to server.js**

Update `backend/server.js` to include:

```javascript
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Add these lines with your other routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
```

---

**Step 16: Create Live Session Controller**

In `backend/controllers/liveSessionController.js`:

```javascript
const { pool } = require('../server');

// Create Live Session
exports.createLiveSession = async (req, res) => {
  try {
    const userId = req.userId;
    const { matchId, session_title, max_duration } = req.body;

    if (!matchId) {
      return res.status(400).json({ error: 'matchId required' });
    }

    // Verify user is part of the match
    const matchResult = await pool.query(
      'SELECT * FROM matches WHERE id = $1 AND (user_id_1 = $2 OR user_id_2 = $2) AND match_status = $3',
      [matchId, userId, 'accepted']
    );

    if (matchResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid match or not accepted' });
    }

    // Create session
    const result = await pool.query(
      'INSERT INTO live_sessions (match_id, initiator_id, session_title, max_duration, session_status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [matchId, userId, session_title || 'Video Call', max_duration || 60, 'active']
    );

    res.status(201).json({
      message: 'Live session created',
      session: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Active Session
exports.getActiveSession = async (req, res) => {
  try {
    const userId = req.userId;
    const { matchId } = req.params;

    const result = await pool.query(
      `SELECT ls.*, u.username, u.profile_photo_url 
       FROM live_sessions ls
       JOIN users u ON ls.initiator_id = u.id
       WHERE ls.match_id = $1 AND ls.session_status = $2
       ORDER BY ls.created_at DESC LIMIT 1`,
      [matchId, 'active']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No active session' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// End Live Session
exports.endLiveSession = async (req, res) => {
  try {
    const userId = req.userId;
    const { sessionId } = req.params;

    // Verify user is initiator
    const sessionResult = await pool.query(
      'SELECT * FROM live_sessions WHERE id = $1 AND initiator_id = $2',
      [sessionId, userId]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to end this session' });
    }

    // Update session status
    const result = await pool.query(
      'UPDATE live_sessions SET session_status = $1, ended_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['ended', sessionId]
    );

    res.json({
      message: 'Session


