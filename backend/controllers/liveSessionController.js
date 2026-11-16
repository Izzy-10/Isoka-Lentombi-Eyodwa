javascript
// Get Session History
exports.getSessionHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { matchId } = req.params;

    const result = await pool.query(
      `SELECT ls.*, u.username, u.profile_photo_url,
              EXTRACT(EPOCH FROM (ls.ended_at - ls.created_at)) as duration_seconds
       FROM live_sessions ls
       JOIN users u ON ls.initiator_id = u.id
       WHERE ls.match_id = $1 AND ls.session_status = $2
       ORDER BY ls.created_at DESC`,
      [matchId, 'ended']
    );

    res.json({
      matchId,
      history: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Join Live Session
exports.joinLiveSession = async (req, res) => {
  try {
    const userId = req.userId;
    const { sessionId } = req.params;

    // Get session details
    const sessionResult = await pool.query(
      'SELECT * FROM live_sessions WHERE id = $1 AND session_status = $2',
      [sessionId, 'active']
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found or ended' });
    }

    const session = sessionResult.rows[0];

    // Check if user is part of the match
    const matchResult = await pool.query(
      'SELECT * FROM matches WHERE id = $1 AND (user_id_1 = $2 OR user_id_2 = $2)',
      [session.match_id, userId]
    );

    if (matchResult.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to join this session' });
    }

    res.json({
      message: 'Joined session successfully',
      session: session,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
