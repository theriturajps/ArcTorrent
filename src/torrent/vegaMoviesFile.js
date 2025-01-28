const axios = require('axios');

async function torrentVegaMovies(query, page = 1) {
	const ALLURL = [];
	const url = `https://vegamovies.ms/page/${page}?s=${query}`;

	try {
		const response = await axios.get(url, {
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.121 Safari/537.36",
			}
		});

		// Convert response to string to work with
		const html = response.data.toString();

		// Find all article elements
		const articleMatches = html.match(/<article[^>]*>([\s\S]*?)<\/article>/g) || [];

		// Extract URLs from each article
		articleMatches.forEach(article => {
			// Look for the post-hover div and extract the first link
			const postHoverMatch = article.match(/<div class="post-inner post-hover"[\s\S]*?<a href="([^"]+)"/);
			if (postHoverMatch && postHoverMatch[1]) {
				ALLURL.push(postHoverMatch[1]);
			}
		});

		return ALLURL;

	} catch (error) {
		console.error("Error fetching data:", error.message);
		return null;
	}
}

module.exports = torrentVegaMovies;