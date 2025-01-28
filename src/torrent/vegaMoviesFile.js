const cheerio = require('cheerio');
const axios = require('axios');

async function torrentVegaMovies(query, page = 1) {
	const ALLURL = [];
	const url = `https://vegamovies.ms/page/${page}?s=${query}`;

	let html;
	try {
		html = await axios.get(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.121 Safari/537.36",
			},
		});
	} catch (error) {
		console.error("Error fetching data:", error.message);
		return null;
	}

	const $ = cheerio.load(html.data);

	// Target the grid wrapper first
	$('#grid-wrapper article').each((_, article) => {
		// Find the link in the post-thumbnail div
		const url = $(article).find('.post-thumbnail > a').first().attr('href');
		if (url && !ALLURL.includes(url)) {
			ALLURL.push(url);
		}
	});

	return ALLURL;
}

module.exports = torrentVegaMovies;