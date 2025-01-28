const express = require('express');
const path = require('path');
const cors = require('cors');
const torrent1337x = require('./torrent/1337x');
const torrentYts = require('./torrent/yts');
const torrentCombo = require('./torrent/COMBO');
const torrentNyaaSI = require('./torrent/nyaaSI');
const torrentGalaxy = require('./torrent/torrentGalaxy');
const torrentTorLock = require('./torrent/torLockFile')
const torrentPirateBay = require('./torrent/pirateBay');
const torrentLimeTorrent = require('./torrent/limeTorrent');
const torrentGlodls = require('./torrent/gloTorrents');
const torrentXprimehub = require('./torrent/xprimehub');

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/:website/:query/:page?', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	let website = (req.params.website).toLowerCase();
	let query = req.params.query;
	let page = req.params.page;

	if (website === '1337x') {
		if (page > 50) {
			return res.json({
				error: 'Please enter page  value less than 51 to get the result :)'
			})
		} else {
			torrent1337x(query, page)
				.then((data) => {
					if (data === null) {
						return res.json({
							error: 'Website is blocked change IP'
						})

					} else if (data.length === 0) {
						return res.json({
							error: 'No search result available for query (' + query + ')'
						})
					} else {
						return res.send(data);
					}

				})
		}
	}
	if (website === 'yts') {
		torrentYts(query, page)
			.then((data) => {
				if (data === null) {
					return res.json({
						error: 'Website is blocked change IP'
					})

				} else if (data.length === 0) {
					return res.json({
						error: 'No search result available for query (' + query + ')'
					})
				} else {
					return res.send(data);
				}

			})
	}
	if (website === 'torlock') {
		torrentTorLock(query, page)
			.then((data) => {
				if (data === null) {
					return res.json({
						error: 'Website is blocked change IP'
					})

				} else if (data.length === 0) {
					return res.json({
						error: 'No search result available for query (' + query + ')'
					})
				} else {
					return res.send(data);
				}

			})
	}
	if (website === 'piratebay') {
		torrentPirateBay(query, page)
			.then((data) => {
				if (data === null) {
					return res.json({
						error: 'Website is blocked change IP'
					})

				} else if (data.length === 0) {
					return res.json({
						error: 'No search result available for query (' + query + ')'
					})
				} else {
					return res.send(data);
				}

			})
	}
	if (website === 'tgx') {
		torrentGalaxy(query, page)
			.then((data) => {
				if (data === null) {
					return res.json({
						error: 'Website is blocked change IP'
					})

				} else if (data.length === 0) {
					return res.json({
						error: 'No search result available for query (' + query + ')'
					})
				} else {
					return res.send(data);
				}

			})
	}

	if (website === 'glodls') {
		torrentGlodls(query, page)
			.then((data) => {
				if (data === null) {
					return res.json({
						error: 'Website is blocked change IP'
					})

				} else if (data.length === 0) {
					return res.json({
						error: 'No search result available for query (' + query + ')'
					})
				} else {
					return res.send(data);
				}
			})
	}

	if (website === 'limetorrent') {
		torrentLimeTorrent(query, page)
			.then((data) => {
				if (data === null) {
					return res.json({
						error: 'Website is blocked change IP'
					})

				} else if (data.length === 0) {
					return res.json({
						error: 'No search result available for query (' + query + ')'
					})
				} else {
					return res.send(data);
				}
			})
	}

	if (website === 'xprimehub') {
		torrentXprimehub(query)
			.then((data) => {
				if (data === null) {
					return res.json({
						error: 'Website is blocked change IP'
					})

				} else if (data.length === 0) {
					return res.json({
						error: 'No search result available for query (' + query + ')'
					})
				} else {
					return res.send(data);
				}
			})
	}

	if (website === 'nyaasi') {
		if (page > 14) {
			return res.json({
				error: '14 is the last page'
			})
		} else {
			torrentNyaaSI(query, page)
				.then((data) => {
					if (data === null) {
						return res.json({
							error: 'Website is blocked change IP'
						})

					} else if (data.length === 0) {
						return res.json({
							error: 'No search result available for query (' + query + ')'
						})
					} else {
						return res.send(data);
					}

				})
		}

	}

	if (website === "all") {
		torrentCombo(query, page).then((data) => {
			if (data !== null && data.length > 0) {
				return res.send(data);
			} else {
				return res.json({
					error: 'No search result available for query (' + query + ')'
				});
			}
		})

	} else if (website !== 'nyaasi' && website !== '1337x' && website !== 'yts' && website !== 'piratebay' && website !== 'torlock' && website !== 'tgx' && website !== 'all' && website !== 'glodls' && website !== 'limetorrent' && website !== 'xprimehub') {
		return res.json({
			error: 'please select 1337x | nyaasi | yts | Piratebay | torlock | eztv | TorrentGalaxy(tgx) | rarbg | zooqle | kickass | bitsearch | glodls | magnetdl | limetorrent | torrentfunk | torrentproject | xprimehub | all (to scrap from every site)'
		})
	}
});

// Route for serving index.html
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// 404 handler - This should come after all valid routes
app.use((req, res, next) => {
	res.status(404).json({
		status: 404,
		error: 'Path not found. Please check the URL and try again.',
		availableRoutes: {
			home: '/',
			api: '/api/:website/:query/:page?',
			supportedWebsites: [
				'1337x', 'nyaasi', 'yts', 'piratebay', 'torlock', 'tgx',
				'glodls', 'limetorrent', 'xprimehub', 'all'
			]
		}
	});
});

// Error handler middleware - This should be the last middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		status: 500,
		error: 'Something went wrong! Please try again later.'
	});
});

const PORT = process.env.PORT || 3000;
console.log(`Server is running on port http://localhost:${PORT}`);
app.listen(PORT);