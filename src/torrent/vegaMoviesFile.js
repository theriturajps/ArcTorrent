const cheerio = require('cheerio');
const axios = require('axios');

async function torrentVegaMovies(query, page = '1') {

	let ALLURL = [];
	if (page === '' || page === '1') {
		var url = "https://vegamovies.ms/?s=" + query;
	} else {
		var url = "https://vegamovies.ms/page/" + page + "?s=" + query;
	}
	let html;
	try {
		html = await axios.get(url, headers = {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.121 Safari/537.36"
		});
	} catch {
		return null;
	}

	const $ = cheerio.load(html.data);
	$('div.post-hover').each((_, element) => {
		let url = $(element).find('a').attr('href');
		ALLURL.push(url);
	})

	return ALLURL;

}

module.exports = torrentVegaMovies;