const cheerio = require('cheerio');
const axios = require('axios');

async function torrentXprimehub(query, page = '1') {
	var ALLTORRENT = [];
	const url = `https://ww4.123moviesfree.net/search/?q=` + query;
	let html;

	try {
		html = await axios.get(url, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
			}
		});
	} catch (error) {
		console.error("Error fetching the URL:", error);
		return null;
	}

	const $ = cheerio.load(html.data);

	// Find all anchor tags (<a>) and push their href attribute to ALLTORRENT
	$('a').each((_, element) => {
		const link = $(element).attr('href');
		if (link) { // Only add links that are valid
			ALLTORRENT.push(link);
		}
	});

	return ALLTORRENT;
}

module.exports = torrentXprimehub;
