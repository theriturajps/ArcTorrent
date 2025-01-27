const torrent1337x = require('../services/1337x');
const torrentYts = require('../services/yts');
const torrentCombo = require('../services/COMBO');
const torrentNyaaSI = require('../services/nyaaSI');
const torrentGalaxy = require('../services/torrentGalaxy');
const torrentTorLock = require('../services/torLockFile');
const torrentPirateBay = require('../services/pirateBay');
const torrentLimeTorrent = require('../services/limeTorrent');
const torrentGlodls = require('../services/gloTorrents');

const searchTorrentsController = async (req, res, next) => {
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

	} else if (website !== 'nyaasi' && website !== '1337x' && website !== 'yts' && website !== 'piratebay' && website !== 'torlock' && website !== 'eztv' && website !== 'tgx' && website !== 'all' && website !== "rarbg" && website !== 'ettv' && website !== 'zooqle' && website !== 'kickass' && website !== 'bitsearch' && website !== 'glodls' && website !== 'magnetdl' && website !== 'limetorrent' && website !== 'torrentfunk' && website !== 'torrentproject') {
		return res.json({
			error: 'please select 1337x | nyaasi | yts | Piratebay | torlock | eztv | TorrentGalaxy(tgx) | rarbg | zooqle | kickass | bitsearch | glodls | magnetdl | limetorrent | torrentfunk | torrentproject | all (to scrap from every site)'
		})
	}

}

module.exports = searchTorrentsController