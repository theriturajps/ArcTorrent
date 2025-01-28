const cheerio = require('cheerio');
const axios = require('axios');

async function torrentXprimehub(query, page = 1) { // Default page is 1 if not specified in the arguments
	const ALLURL = [];
	const url = `https://xprimehub.vip/page/${page}/?s=${query}`; // https://xprimehub.vip/page/2/?s=download

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
	$('div.bw_title').each((_, element) => {
		const url = $(element).find('a');
		ALLURL.push(url);
	});

	return ALLURL; // Return the array of URLs
}

module.exports = torrentXprimehub;
