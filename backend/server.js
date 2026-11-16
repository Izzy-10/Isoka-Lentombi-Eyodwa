`javascript
const authRoutes = require('./routes/authRoutes');

// Add this before app.listen()
app.use('/api/auth', authRoutes);
