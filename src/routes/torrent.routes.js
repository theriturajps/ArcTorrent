const express = require('express');
const router = express.Router();
const torrentController = require('../controllers/torrent.controller');

router.get('/:website/:query/:page?', torrentController.search);

module.exports = router;