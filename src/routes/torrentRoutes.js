const express = require('express');
const router = express.Router();
const torrentController = require('../controllers/torrentController');

router.get('/:website/:query/:page?', torrentController);

module.exports = router;