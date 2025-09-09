const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireOwnership = (req, res, next) => {
  const { user } = req;
  const targetUserId = Number(req.params.userId || req.body.user_id || req.query.user_id);
  if (targetUserId && user && Number(user.id) !== targetUserId) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

module.exports = { authenticateToken, requireOwnership };
