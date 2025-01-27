const torrent1337x = require('../services/1337x');
const torrentYts = require('../services/yts');
const torrentCombo = require('../services/COMBO');
const torrentNyaaSI = require('../services/nyaaSI');
const torrentGalaxy = require('../services/torrentGalaxy');
const torrentTorLock = require('../services/torLockFile');
const torrentPirateBay = require('../services/pirateBay');
const torrentLimeTorrent = require('../services/limeTorrent');
const torrentGlodls = require('../services/gloTorrents');

const searchTorrents = async (req, res) => {
	const website = req.params.website.toLowerCase();
	const query = req.params.query;
	const page = req.params.page;

	try {
		let data;
		switch (website) {
			case '1337x':
				if (page > 50) {
					return res.json({ error: 'Please enter page value less than 51 to get the result :)' });
				}
				data = await torrent1337x(query, page);
				break;
			case 'yts':
				data = await torrentYts(query, page);
				break;
			case 'nyaasi':
				if (page > 14) {
					return res.json({ error: '14 is the last page' });
				}
				data = await torrentNyaaSI(query, page);
				break;
			case 'tgx':
				data = await torrentGalaxy(query, page);
				break;
			case 'torlock':
				data = await torrentTorLock(query, page);
				break;
			case 'piratebay':
				data = await torrentPirateBay(query, page);
				break;
			case 'limetorrent':
				data = await torrentLimeTorrent(query, page);
				break;
			case 'glodls':
				data = await torrentGlodls(query, page);
				break;
			case 'all':
				data = await torrentCombo(query, page);
				break;
			default:
				return res.json({
					error: 'please enter valid website name (1337x, yts, nyaasi, tgx, torlock, piratebay, limetorrent, glodls and all)'
				});
		}

		if (data === null) {
			return res.json({ error: 'Website is blocked change IP' });
		} else if (data.length === 0) {
			return res.json({ error: `No search result available for query (${query})` });
		}

		return res.json(data);
	} catch (error) {
		console.error('Error searching torrents:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

module.exports = searchTorrents