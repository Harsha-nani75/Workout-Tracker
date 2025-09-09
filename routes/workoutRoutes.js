const express = require('express');
const { create, update, remove, get, list, complete, report } = require('../controllers/workoutController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authenticateToken);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.get('/:id', get);
router.get('/', list);
router.post('/:id/complete', complete);
router.get('/reports/daily', report);

module.exports = router;
