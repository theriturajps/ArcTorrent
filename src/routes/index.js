const express = require('express');
const router = express.Router();
const torrentRoutes = require('./torrentRoutes');

router.use('/api', torrentRoutes);

module.exports = router;