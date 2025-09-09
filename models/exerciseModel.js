const pool = require('../config/db');

const Exercise = {
  create: async ({ name, description, category, muscle_group }) => {
    const [result] = await pool.execute(
      'INSERT INTO exercises (name, description, category, muscle_group) VALUES (?, ?, ?, ?)',
      [name, description, category, muscle_group]
    );
    return { id: result.insertId };
  },

  list: async ({ search = '', limit = 50, offset = 0 } = {}) => {
    const q = `%${search}%`;
    const [rows] = await pool.execute(
      'SELECT * FROM exercises WHERE name LIKE ? OR description LIKE ? OR category LIKE ? OR muscle_group LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?',
      [q, q, q, q, Number(limit), Number(offset)]
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.execute('SELECT * FROM exercises WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = Exercise;
