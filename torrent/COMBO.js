const torrentYts = require('./yts');
const torrent1337x = require('./1337x');
const torrentNyaaSI = require('./nyaaSI');
const torrentGalaxy = require('./torrentGalaxy');

async function torrentCombo(query, page) {
	let comboTorrent = []
	await Promise.all([
		torrentYts(query, page),
		torrent1337x(query, page),
		torrentGalaxy(query, page)
	])
		.then(([yts, x1337, nyaasi, tgx]) => {

			if (yts !== null && yts.length > 0) {
				comboTorrent.push(yts);
			}
			if (x1337 !== null && x1337.length > 0) {
				comboTorrent.push(x1337);
			}
			if(nyaasi !== null && nyaasi.length > 0){
				comboTorrent.push(nyaasi);
			}
			if(tgx !== null && tgx.length > 0){
				comboTorrent.push(tgx);
			}
		})
	return comboTorrent;
}
module.exports = torrentCombo;