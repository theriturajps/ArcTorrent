const scrap1337x = require('./1337x');
const scrapNyaa = require('./nyaaSI');
const scrapYts = require('./yts');
const scrapPirateBay = require('./pirateBay');
const scrapTorLock = require('./torLockFile');
const torrentGalaxy = require('./torrentGalaxy');
const glodls = require('./gloTorrents');
const limeTorrent = require('./limeTorrent');


async function torrentCombo(query, page) {
	let comboTorrent = []
	await Promise.all([
		torrentGalaxy(query, page),
		scrapNyaa(query, page),
		scrapYts(query, page),
		scrapPirateBay(query, page),
		scrapTorLock(query, page),
		scrap1337x(query, page),
		kickAss(query, page),
		glodls(query, page),
		limeTorrent(query, page)
	])
		.then(([tgx, nyaasi, yts, piratebay, torlock, x1337, glodls, limetorrent]) => {

			if (tgx !== null && tgx.length > 0) {
				comboTorrent.push(tgx);
			}
			if (nyaasi !== null && nyaasi.length > 0) {
				comboTorrent.push(nyaasi);
			}
			if (yts !== null && yts.length > 0) {
				comboTorrent.push(yts);
			}
			if (piratebay !== null && piratebay.length > 0) {
				comboTorrent.push(piratebay);
			}
			if (torlock !== null && torlock.length > 0) {
				comboTorrent.push(torlock);
			}
			if (x1337 !== null && x1337.length > 0) {
				comboTorrent.push(x1337);
			}
			if (glodls !== null && glodls.length > 0) {
				comboTorrent.push(glodls);
			}
			if (limetorrent !== null && limetorrent.length > 0) {
				comboTorrent.push(limetorrent);
			}
		})
	return comboTorrent;
}
module.exports = torrentCombo;