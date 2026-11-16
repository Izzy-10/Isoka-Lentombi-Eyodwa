bash
touch messageController.js
```

Open `backend/controllers/messageController.js` and paste:

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
    const { limit = 50, offset = 0 } = req.query;

    // Verify user is part of this match
    const matchResult = await pool.query(
      'SELECT * FROM matches WHERE id = $1 AND (user_id_1 = $2 OR user_id_2 = $2)',
      [matchId, userId]
    );

    if (matchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Get messages
    const result = await pool.query(
      'SELECT m.*, u.username, u.profile_photo_url FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.match_id = $1 ORDER BY m.created_at DESC LIMIT $2 OFFSET $3',
      [matchId, limit, offset]
    );

    res.json({
      matchId,
      messages: result.rows.reverse(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get All Conversations
exports.getConversations = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT 
        m.id, 
        m.match_status,
        m.matched_at,
        CASE 
          WHEN m.user_id_1 = $1 THEN u2.id
          ELSE u1.id
        END as other_user_id,
        CASE 
          WHEN m.user_id_1 = $1 THEN u2.username
          ELSE u1.username
        END as other_user_name,
        CASE 
          WHEN m.user_id_1 = $1 THEN u2.profile_photo_url
          ELSE u1.profile_photo_url
        END as other_user_photo,
        (SELECT content FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1) as last_message_time
       FROM matches m
       JOIN users u1 ON m.user_id_1 = u1.id
       JOIN users u2 ON m.user_id_2 = u2.id
       WHERE (m.user_id_1 = $1 OR m.user_id_2 = $1)
       AND m.match_status = 'accepted'
       ORDER BY last_message_time DESC`,
      [userId]
    );

    res.json({
      conversations: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete Message
exports.deleteMessage =
