const express = require('express');
const torrentRouter = express.Router();
const searchTorrentsController = require('../controllers/torrentController');

torrentRouter.get('/:website/:query/:page?', searchTorrentsController);

module.exports = torrentRouter;