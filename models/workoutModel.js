const pool = require('../config/db');

const Workout = {
  create: async ({ user_id, title, notes, scheduled_at, exercises = [] }) => {
    const [res] = await pool.execute(
      'INSERT INTO workouts (user_id, title, notes, scheduled_at) VALUES (?, ?, ?, ?)',
      [user_id, title, notes || null, scheduled_at || null]
    );
    const workoutId = res.insertId;

    if (exercises.length) {
      const values = [];
      const placeholders = exercises.map(() => '(?, ?, ?, ?, ?)').join(', ');
      exercises.forEach(ex => {
        values.push(workoutId, ex.exercise_id, ex.sets || 3, ex.reps || 10, ex.weight || 0);
      });
      await pool.execute(
        `INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, weight) VALUES ${placeholders}`,
        values
      );
    }

    return { id: workoutId };
  },

  update: async (id, { title, notes, scheduled_at, status }) => {
    const sets = [];
    const vals = [];
    if (title !== undefined) { sets.push('title = ?'); vals.push(title); }
    if (notes !== undefined) { sets.push('notes = ?'); vals.push(notes); }
    if (scheduled_at !== undefined) { sets.push('scheduled_at = ?'); vals.push(scheduled_at); }
    if (status !== undefined) { sets.push('status = ?'); vals.push(status); }
    if (!sets.length) return;
    vals.push(id);
    await pool.execute(`UPDATE workouts SET ${sets.join(', ')} WHERE id = ?`, vals);
  },

  delete: async (id) => {
    await pool.execute('DELETE FROM workouts WHERE id = ?', [id]);
  },

  listByUser: async ({ user_id, upcoming = true, limit = 20, offset = 0 }) => {
    const op = upcoming ? 'scheduled_at >= NOW()' : 'scheduled_at < NOW()';
    const [rows] = await pool.execute(
      `SELECT * FROM workouts WHERE user_id = ? AND scheduled_at IS NOT NULL AND ${op} ORDER BY scheduled_at ASC LIMIT ? OFFSET ?`,
      [user_id, Number(limit), Number(offset)]
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.execute('SELECT * FROM workouts WHERE id = ?', [id]);
    const workout = rows[0];
    if (!workout) return null;
    const [exRows] = await pool.execute(
      `SELECT we.*, e.name, e.category, e.muscle_group
       FROM workout_exercises we
       JOIN exercises e ON e.id = we.exercise_id
       WHERE we.workout_id = ?`,
      [id]
    );
    workout.exercises = exRows;
    return workout;
  },

  logCompletion: async (workout_id, summary) => {
    const [res] = await pool.execute(
      'INSERT INTO workout_logs (workout_id, summary, performed_at) VALUES (?, ?, NOW())',
      [workout_id, summary || null]
    );
    return { id: res.insertId };
  },

  reportsForUser: async (user_id, { from, to } = {}) => {
    // simple example: count logs by date
    const params = [user_id];
    let where = 'w.user_id = ?';
    if (from) { where += ' AND wl.performed_at >= ?'; params.push(from); }
    if (to) { where += ' AND wl.performed_at <= ?'; params.push(to); }
    const [rows] = await pool.execute(
      `SELECT DATE(wl.performed_at) as date, COUNT(*) as sessions
       FROM workouts w
       JOIN workout_logs wl ON wl.workout_id = w.id
       WHERE ${where}
       GROUP BY DATE(wl.performed_at)
       ORDER BY date DESC`,
      params
    );
    return rows;
  }
};

module.exports = Workout;
