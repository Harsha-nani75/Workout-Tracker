const express = require('express');
const { list, create, get } = require('../controllers/exerciseController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', list);
router.get('/:id', get);
router.post('/', authenticateToken, create);

module.exports = router;
