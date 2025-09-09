const Workout = require('../models/workoutModel');

const create = async (req, res) => {
  try {
    const user_id = Number(req.user.id);
    const { title, notes, scheduled_at, exercises } = req.body;
    const created = await Workout.create({ user_id, title, notes, scheduled_at, exercises });
    res.status(201).json({ workoutId: created.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    await Workout.update(Number(req.params.id), req.body);
    res.json({ message: 'Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    await Workout.delete(Number(req.params.id));
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const get = async (req, res) => {
  const w = await Workout.findById(Number(req.params.id));
  if (!w) return res.status(404).json({ error: 'Not found' });
  res.json(w);
};

const list = async (req, res) => {
  const user_id = Number(req.user.id);
  const upcoming = req.query.upcoming !== 'false';
  const limit = Number(req.query.limit || 20);
  const offset = Number(req.query.offset || 0);
  const rows = await Workout.listByUser({ user_id, upcoming, limit, offset });
  res.json({ workouts: rows });
};

const complete = async (req, res) => {
  try {
    const { summary } = req.body;
    const { id } = req.params;
    const log = await Workout.logCompletion(Number(id), summary);
    res.json({ logId: log.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const report = async (req, res) => {
  const user_id = Number(req.user.id);
  const { from, to } = req.query;
  const rows = await Workout.reportsForUser(user_id, { from, to });
  res.json({ report: rows });
};

module.exports = { create, update, remove, get, list, complete, report };
