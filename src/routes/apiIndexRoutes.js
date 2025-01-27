const express = require('express');
const apiIndexRouter = express.Router();
const torrentRoutes = require('./torrentRoutes');

apiIndexRouter.use('/api', torrentRoutes);

module.exports = apiIndexRouter;