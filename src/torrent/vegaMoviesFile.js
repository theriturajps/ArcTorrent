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

	const data = html.data;
	const parser = new DOMParser();
	const document = parser.parseFromString(data, "text/html");

	// Extract URLs from the specified elements
	const elements = document.querySelectorAll('div.post-hover a');
	elements.forEach((element) => {
		const url = element.href;
		if (url) {
			ALLURL.push(url);
		}
	});

	return ALLURL; // Return the array of URLs
}

module.exports = torrentVegaMovies;