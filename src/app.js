const express = require('express');
const path = require('path');
const cors = require('cors');
const apiIndexRouter = require('./routes/apiIndexRoutes');

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, '..' ,'public')));

// Routes
app.use('/', apiIndexRouter);

// Serve index.html for root route
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname,'..' ,'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port http://localhost:${PORT}`);
});