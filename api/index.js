const express = require('express');
const cors = require('cors');
const scrap1337x = require('./scraper/1337x');
const path = require('path')

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.get('/api/:website/:query/:page?', async (req, res) => {
	const { website, query, page } = req.params;

	if (website === '1337x') {
		try {
			const data = await scrap1337x(query, page || '1');

			if (data === null) {
				return res.status(500).json({ error: 'Scraping failed' });
			}

			if (data.length === 0) {
				return res.status(404).json({ error: `No results for ${query}` });
			}

			return res.json(data);
		} catch (error) {
			return res.status(500).json({ error: error.message });
		}
	}

	return res.status(400).json({ error: 'Unsupported website' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})