javascript
const { pool } = require('../server');

// Create a Match
exports.createMatch = async (req, res) => {
  try {
    const userId1 = req.userId;
    const { userId2 } = req.body;

    if (userId1 === userId2)
