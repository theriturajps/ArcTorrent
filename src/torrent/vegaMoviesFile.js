const cheerio = require('cheerio');
const axios = require('axios');

async function torrentVegaMovies(query, page = 1) { // Default page is 1 if not specified in the arguments
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
		return null; // Return null if there's an error
	}

	const $ = cheerio.load(html.data);

	// Extract URLs from the specified elements
	$('div.post-hover').each((_, element) => {
		const url = $(element).find('a').attr('href');
		ALLURL.push(url);
	});

	return ALLURL; // Return the array of URLs
}

module.exports = torrentVegaMovies;