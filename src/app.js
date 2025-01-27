const express = require('express');
const path = require('path');
const cors = require('cors');
const { PORT } = require('./config/constants');
const torrentRoutes = require('./routes/torrent.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api', torrentRoutes);

// Serve index.html
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port http://localhost:${PORT}`);
});