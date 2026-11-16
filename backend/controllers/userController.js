javascript
const { pool } = require('../server');

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      'SELECT id, username, email, first_name, last_name, bio, profile_photo_url, age, location, interests, tiktok_username, verification_status, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { first_name, last_name, bio, age, location, interests, tiktok_username, profile_photo_url } = req.body;

    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, bio = $3, age = $4, location = $5, interests = $6, tiktok_username = $7, profile_photo_url = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
      [first_name, last_name, bio, age, location, interests, tiktok_username, profile_photo_url, userId]
    );

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get All Users (for discovery)
exports.getAllUsers = async (req, res) => {
  try {
    const userId = req.userId;
    const { age_min, age_max, location } = req.query;

    let query = 'SELECT id, username, first_name, last_name, bio, profile_photo_url, age, location, interests, tiktok_username FROM users WHERE id != $1';
    const params = [userId];

    if (age_min && age_max) {
      query += ` AND age BETWEEN $${params.length + 1} AND $${params.length + 2}`;
      params.push(age_min, age_max);
    }

    if (location) {
      query += ` AND location = $${params.length + 1}`;
      params.push(location);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Single User
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      'SELECT id, username, first_name, last_name, bio, profile_photo_url, age, location, interests, tiktok_username, verification_status FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
