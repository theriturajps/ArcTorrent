const cheerio = require('cheerio')
const axios = require('axios')

async function limeTorrent(query, page = '1') {
	var ALLTORRENT = [];
	const url = `https://xprimehub.vip/page/${page}/?s=${query}`;
	let html;
	try {
		html = await axios.get(url, headers = {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.121 Safari/537.36"
		});

	} catch {
		return null;
	}

	const $data = cheerio.load(html.data);

	ALLTORRENT.push($data)

	return ALLTORRENT;

}
module.exports = limeTorrent