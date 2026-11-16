javascript
const { pool } = require('../server');

// Create a Match
exports.createMatch = async (req, res) => {
  try {
    const userId1 = req.userId;
    const { userId2 } = req.body;

    if (userId1 === userId2) {
      return res.status(400).json({ error: 'Cannot match with yourself' });
    }

    // Check if match already exists
    const existing = await pool.query(
      'SELECT * FROM matches WHERE (user_id_1 = $1 AND user_id_2 = $2) OR (user_id_1 = $2 AND user_id_2 = $1)',
      [userId1, userId2]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Match already exists' });
    }

    // Create match
    const result = await pool.query(
      'INSERT INTO matches (user_id_1, user_id_2, match_status) VALUES ($1, $2, $3) RETURNING *',
      [userId1, userId2, 'pending']
    );

    res.status(201).json({
      message: 'Like sent!',
      match: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Accept Match
exports.acceptMatch = async (req, res) => {
  try {
    const userId = req.userId;
    const { matchId } = req.params;

    const result = await pool.query(
      'UPDATE matches SET match_status = $1 WHERE id = $2 AND (user_id_1 = $3 OR user_id_2 = $3) RETURNING *',
      ['accepted', matchId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json({
      message: 'Match accepted! You are now connected!',
      match: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Reject Match
exports.rejectMatch = async (req, res) => {
  try {
    const userId = req.userId;
    const { matchId } = req.params;

    const result = await pool.query(
      'UPDATE matches SET match_status = $1 WHERE id = $2 AND (user_id_1 = $3 OR user_id_2 = $3) RETURNING *',
      ['rejected', matchId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json({ message: 'Match rejected' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get User Matches
exports.getUserMatches = async (req, res) => {
  try {
    const userId = req.userId;
    const { status } = req.query;

    let query = 'SELECT m.*, u1.username as user1_name, u1.profile_photo_url as user1_photo, u2.username as user2_name, u2.profile_photo_url as user2_photo FROM matches m JOIN users u1 ON m.user_id_1 = u1.id JOIN users u2 ON m.user_id_2 = u2.id WHERE (m.user_id_1 = $1 OR m.user_id_2 = $1)';
    const params = [userId];

    if (status) {
      query += ` AND m.match_status = $2`;
      params.push(status);
    }

    query += ' ORDER BY m.matched_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Matching Algorithm
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.userId;

    // Get current user's interests
    const userResult = await pool.query(
      'SELECT age, location, interests FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 
