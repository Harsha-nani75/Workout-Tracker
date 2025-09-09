const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const workoutRoutes = require('./routes/workoutRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// API
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts', workoutRoutes);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

module.exports = app;
