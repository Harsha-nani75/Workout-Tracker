const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  create: async ({ name, email, password }) => {
    const hashed = bcrypt.hashSync(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    );
    return { id: result.insertId, name, email };
  },

  findByEmail: async (email) => {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  findById: async (id) => {
    const [rows] = await pool.execute('SELECT id, name, email, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = User;
