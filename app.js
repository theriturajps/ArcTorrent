const express = require('express');
const path = require('path');
const cors = require('cors');
const torrent1337x = require('./torrent/1337x');
const torrentYts = require('./torrent/yts');
const torrentCombo = require('./torrent/COMBO');
const torrentNyaaSI = require('./torrent/nyaaSI');
const torrentGalaxy = require('./torrent/torrentGalaxy');

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

const RESULTS_PER_PAGE = 10;

app.use('/api/:website/:query/:page?', async (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	const website = (req.params.website).toLowerCase();
	const query = req.params.query;
	let page = parseInt(req.params.page) || 1;

	// Validate page number
	if (page < 1) page = 1;

	try {
		let results;
		switch (website) {
			case '1337x':
				if (page > 50) {
					return res.json({ error: 'Page value must be less than 51' });
				}
				results = await torrent1337x(query, page);
				break;
			case 'yts':
				results = await torrentYts(query, page);
				break;
			case 'nyaasi':
				if (page > 14) {
					return res.json({ error: '14 is the last page' });
				}
				results = await torrentNyaaSI(query, page);
				break;
			case 'tgx':
				results = await torrentGalaxy(query, page);
				break;
			case 'all':
				results = await torrentCombo(query, page);
				break;
			default:
				return res.json({ error: 'Invalid website name' });
		}

		// Validate and handle results
		if (results === null) {
			return res.json({ error: 'Website is blocked or unavailable' });
		}

		if (results.length === 0) {
			return res.json({ error: `No results for query: ${query}` });
		}

		// Return paginated results
		const startIndex = (page - 1) * RESULTS_PER_PAGE;
		const endIndex = startIndex + RESULTS_PER_PAGE;
		const paginatedResults = results.slice(startIndex, endIndex);

		res.json({
			total: results.length,
			page: page,
			totalPages: Math.ceil(results.length / RESULTS_PER_PAGE),
			results: paginatedResults
		});

	} catch (error) {
		console.error('API Error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

app.use('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
console.log('Listening on PORT : ', PORT);
app.listen(PORT);