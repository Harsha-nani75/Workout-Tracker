const Exercise = require('../models/exerciseModel');

const list = async (req, res) => {
  const { q, limit = 50, page = 1 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  const items = await Exercise.list({ search: q || '', limit: Number(limit), offset });
  res.json({ exercises: items });
};

const create = async (req, res) => {
  const { name, description, category, muscle_group } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const created = await Exercise.create({ name, description, category, muscle_group });
  res.status(201).json({ exerciseId: created.id });
};

const get = async (req, res) => {
  const ex = await Exercise.findById(Number(req.params.id));
  if (!ex) return res.status(404).json({ error: 'Not found' });
  res.json(ex);
};

module.exports = { list, create, get };
