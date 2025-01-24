async function torrentCombo(query, page) {
	let comboTorrent = []
	await Promise.all([
		torrentYts(query, page),
		torrent1337x(query, page),
	])
		.then(([yts, x1337]) => {

			if (yts !== null && yts.length > 0) {
				comboTorrent.push(yts);
			}
			if (x1337 !== null && x1337.length > 0) {
				comboTorrent.push(x1337);
			}
		})
	return comboTorrent;
}
module.exports = torrentCombo;